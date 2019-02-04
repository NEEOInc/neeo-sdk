import axios from 'axios';
import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import { coerce, satisfies } from 'semver';
import config from '../config';
import { ExpressBrainDriver } from '../expressBrainDriver';
import * as Models from '../models';
import * as Brain from './brain';
import buildBrainUrl from './brain/urlBuilder';
import { Database } from './database';
import { DeviceBuilder } from './deviceBuilder';
import { RequestHandler } from './handler/requestHandler';
import DeviceState from './implementationservices/deviceState';
import ListBuilder from './lists/listBuilder';
import * as validation from './validation';

const MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN = 8;
let brainDriver: ExpressBrainDriver;
const debug = Debug('neeo:device:device');

/* tslint:disable:max-line-length */

/**
 * Create new device factory, builds a searchable device for the NEEO Brain
 * @function
 * @see {@link DeviceBuilder}
 * @param {String} DeviceName The device name
 * @return {DeviceBuilder} factory methods to build device
 * @example
 *  neeoapi.buildDevice('simpleDevice1')
 *    .setManufacturer('NEEO')
 *    .addAdditionalSearchToken('foo')
 *    .setType('light')
 *    .addButton({ name: 'example-button', label: 'my button' }, controller.button)
 *    .addSwitch({ name: 'example-switch', label: 'my switch' },
 *      { setter: controller.switchSet, getter: controller.switchGet })
 *    .addSlider({ name: 'example-slider', label: 'my slider', range: [0,110], unit: '%' },
 *      { setter: controller.sliderSet, getter: controller.sliderGet });
 */
const buildDevice = buildCustomDevice;
// Using 2 lines because doxdox doesn't always understand export statements.
export { buildDevice };

export function buildCustomDevice(
  adapterName: string,
  uniqueString?: string
): Models.DeviceBuilder {
  if (!adapterName) {
    throw new Error('MISSING_ADAPTERNAME');
  }
  return new DeviceBuilder(adapterName, uniqueString);
}

/**
 * Create new list factory, builds a browsable list which can be used for a specific device, for example to browse a playlist
 * @function
 * @see {@link ListBuilder}
 * @param {Object} configuration JSON Configuration Object
 * @param {String} configuration.title title of the list
 * @param {Number} configuration.totalMatchingItems how many results the query included in total (used for pagination)
 * @param {Number} configuration.limit optional, how many items should be queried per page (used for pagination). The default and maximum is 64.
 * @param {Number} configuration.offset optional, default starting offset (used for pagination)
 * @param {String} configuration.browseIdentifier optional, identifier that is passed with a browse request to identify which "path" should be browsed
 * @return {ListBuilder} factory methods to build list
 * @example
 *  neeoapi.buildBrowseList({
 *      title: 'list title',
 *      totalMatchingItems: 100,
 *      limit: 20,
 *      offset: 0,
 *      browseIdentifier: 'browseEverything'
 *    })
 *    .addListHeader('NEEO Header')
 *    .addListItem({
 *      title: 'foo'
 *    })
 */
export function buildBrowseList(options: Models.ListParameters): Models.ListBuilder {
  return new ListBuilder(options);
}

/**
 * This function builds a new DeviceState Object which helps organise client states, cache states and reachability
 * @function
 * @see {@link DeviceState}
 * @param {integer} cacheTimeMs how long should a devicestate be cached (optional, default is 2000ms)
 * @return {DeviceState} a new DeviceState instance
 * @example
 *  const deviceState = neeoapi.buildDeviceState(2000);
 */
export function buildDeviceState(cacheTimeMs: number): Models.DeviceState {
  return new DeviceState(cacheTimeMs);
}

export function startServer(conf: Models.StartServerConfig, driver: ExpressBrainDriver) {
  if (!conf || !driver) {
    return BluePromise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }

  let { maxConnectionAttempts } = conf;
  const { baseurl, brain, brainport } = conf;

  brainDriver = driver;

  if (!maxConnectionAttempts) {
    maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
  }

  const adapterName = generateAdapterName(conf);
  const baseUrl = baseurl || generateBaseUrl(conf);

  return validateBrainVersion(brain, brainport)
    .then(() => buildDevicesDatabase(conf, adapterName))
    .then((devicesDatabase) => RequestHandler.build(devicesDatabase))
    .then((requestHandler) =>
      startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl)
    )
    .then(() => fetchDeviceSubscriptionsIfNeeded(conf.devices));
}

/**
 * Stops the internal REST server and unregister this adapter on the NEEO Brain
 * @function
 * @param {Object} configuration JSON Configuration Object
 * @param {NEEOBrain} configuration.brain NEEOBrain object
 * @param {String} configuration.name device name
 * @return {Promise} will be resolved when adapter is unregistered and REST server is stopped
 * @example
 * neeoapi.stopServer({ brain: brain, name: 'custom-adapter' });
 */
export function stopServer(conf: Models.StopServerConfig) {
  if (!conf || !conf.brain || !conf.name) {
    return BluePromise.reject('INVALID_STOPSERVER_PARAMETER');
  }

  const adapterName = validation.getUniqueName(conf.name);
  const stopDriver = brainDriver ? brainDriver.stop(conf) : Promise.resolve();

  return Promise.all([Brain.stop({ brain: conf.brain, adapterName }), stopDriver]);
}

/*
  Note: the unique name needs to start with "src-" to be recognised by the Brain
 */
function generateAdapterName({ name }: { name: string }) {
  return name === 'neeo-deviceadapter' ? name : `src-${validation.getUniqueName(name)}`;
}

function generateBaseUrl({ port }: { port: number }) {
  const baseUrl = `http://${validation.getAnyIpAddress()}:${port}`;
  debug('Adapter baseUrl %s', baseUrl);
  return baseUrl;
}

function buildDevicesDatabase(conf, adapterName) {
  return new BluePromise((resolve) => {
    const devices = conf.devices.map((device) => {
      return buildAndRegisterDevice(device, adapterName);
    });

    resolve(Database.build(devices));
  });
}

function buildAndRegisterDevice(device: Models.DeviceBuilder, adapterName: string) {
  if (!device || typeof device.build !== 'function') {
    throw new Error(`Invalid device detected! Check the ${adapterName} driver device exports.`);
  }
  const deviceModel = device.build(adapterName);
  if (deviceModel.subscriptionFunction) {
    const boundNotificationFunction = (param) => {
      debug('notification %o', param);
      return Brain.sendSensorNotification(param, deviceModel.adapterName);
    };

    let optionalCallbacks = {};
    if (device.hasPowerStateSensor) {
      const powerOnNotificationFunction = (uniqueDeviceId) => {
        const msg = { uniqueDeviceId, component: 'powerstate', value: true };
        return Brain.sendNotification(msg, deviceModel.adapterName).catch((error) => {
          debug('POWERON_NOTIFICATION_FAILED', error.message);
        });
      };
      const powerOffNotificationFunction = (uniqueDeviceId) => {
        const msg = { uniqueDeviceId, component: 'powerstate', value: false };
        return Brain.sendNotification(msg, deviceModel.adapterName).catch((error) => {
          debug('POWEROFF_NOTIFICATION_FAILED', error.message);
        });
      };
      optionalCallbacks = {
        powerOnNotificationFunction,
        powerOffNotificationFunction,
      };
    }
    deviceModel.subscriptionFunction(boundNotificationFunction, optionalCallbacks);
  }
  return deviceModel;
}

function startSdkAndRetryIfConnectionFailed(
  conf: Models.StartServerConfig,
  adapterName: string,
  requestHandler: RequestHandler,
  baseUrl: string,
  attemptCount = 1
): Promise<void> {
  const { brain, brainport, maxConnectionAttempts } = conf;

  return brainDriver
    .start(conf, requestHandler)
    .then(() => Brain.start({ brain, brainport, baseUrl, adapterName }))
    .catch((error) => {
      debug('ERROR: Could not connect to NEEO Brain %o', {
        attemptCount,
        error: error.message,
      });
      if (maxConnectionAttempts && attemptCount > maxConnectionAttempts) {
        debug('maximal retry exceeded, fail now..');
        return BluePromise.reject(new Error('BRAIN_NOT_REACHABLE'));
      }
      return BluePromise.delay(attemptCount * 1000).then(() =>
        startSdkAndRetryIfConnectionFailed(
          conf,
          adapterName,
          requestHandler,
          baseUrl,
          attemptCount + 1
        )
      );
    });
}

function validateBrainVersion(brain: string | Models.BrainModel, brainPort?: number) {
  const urlPrefix = buildBrainUrl(brain, undefined, brainPort);

  return axios.get(`${urlPrefix}/systeminfo`).then(({ data }) => {
    const brainVersion = data.firmwareVersion;
    checkVersionSatisfaction(brainVersion);
  });
}

function checkVersionSatisfaction(brainVersion: string) {
  const { brainVersionSatisfaction } = config;
  const brainVersionSatisfied = satisfies(coerce(brainVersion)!, brainVersionSatisfaction);
  if (!brainVersionSatisfied) {
    throw new Error(
      `The Brain version must satisfy ${brainVersionSatisfaction}. Please make sure that the firmware is up-to-date.`
    );
  }
}

function fetchDeviceSubscriptionsIfNeeded(devices: ReadonlyArray<Models.DeviceBuilder>) {
  const promises = devices.reduce(
    (output, device) => {
      const deviceHandlers = device.deviceSubscriptionHandlers;
      if (deviceHandlers) {
        debug('Initializing device subscriptions for %s', device.devicename);
        output.push(
          Brain.getSubscriptions(device.deviceidentifier).then(deviceHandlers.initializeDeviceList)
        );
      }
      return output;
    },
    [] as Array<Promise<any>>
  );
  if (!promises.length) {
    return;
  }
  // do not wait until the subscription promises are finished
  Promise.all(promises).catch((error) => {
    debug('Initializing device subscriptions failed for at least one device', error.message);
  });
}
