import * as Debug from 'debug';
import axios from 'axios';
import { coerce, satisfies } from 'semver';
import * as Models from '../models';
import * as Brain from './brain';
import * as validation from './validation';
import { Database } from './database';
import { RequestHandler } from './handler';
import { ExpressBrainDriver } from '../expressBrainDriver';
import DeviceBuilder from './deviceBuilder';
import DeviceState from './implementationServices/deviceState';
import buildBrainUrl from './brain/urlBuilder';
import config from '../config';

const MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN = 8;
let brainDriver: ExpressBrainDriver;
const debug = Debug('neeo:device:device');

/**
 * Get a device builder for building a custom device adapter.
 * @param adapterName The desired adapter name for the custom device.
 * @param uniqueString (Optional) unique string suffix identifier.
 * @example
 *  neeoSdk
 * .buildDevice('My Device Adapter')
 * .setManufacturer('NEEO');
 */
export function buildCustomDevice(
  adapterName: string,
  uniqueString?: string
): Models.DeviceBuilder {
  if (!adapterName) {
    throw new Error('MISSING_ADAPTERNAME');
  }
  return new DeviceBuilder(adapterName, uniqueString);
}

export function buildDeviceState(): Models.DeviceState {
  return new DeviceState();
}

export function startServer(
  conf: Models.StartServerConfig,
  driver: ExpressBrainDriver
) {
  if (!conf || !driver) {
    return Promise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }
  let { port, brain, name, devices, maxConnectionAttempts, baseurl } = conf;
  if (!port || !brain || !name || !devices) {
    return Promise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }
  brainDriver = driver;
  if (!maxConnectionAttempts) {
    conf.maxConnectionAttempts = maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
  }
  const adapterName = generateAdapterName(conf);
  if (!baseurl) {
    conf.baseurl = baseurl = generateBaseUrl(conf);
  }

  return validateBrainVersion(conf.brain, conf.brainport)
    .then(() => {
      return startSdkAndRetryIfConnectionFailed(
        conf,
        adapterName,
        new RequestHandler(buildDevicesDatabase(conf, adapterName)),
        baseurl
      );
    })
    .then(() => fetchDeviceSubscriptionsIfNeeded(conf.devices));
}

/**
 * Stops the internal REST server and unregister this adapter on the NEEO Brain
 * @param Object with **brain** as a model (or host name string) and adapter **name**.
 * @return Promise that will be resolved when adapter is unregistered and REST server is stopped.
 * @example
 * neeoapi.stopServer({ brain, name: 'custom-adapter' });
 */
export function stopServer(conf: Models.StopServerConfig) {
  if (!conf || !conf.brain || !conf.name) {
    throw new Error('INVALID_STOPSERVER_PARAMETER');
  }
  const adapterName = validation.getUniqueName(conf.name);
  return Promise.all([
    Brain.stop({ brain: conf.brain, adapterName }),
    brainDriver ? brainDriver.stop() : Promise.resolve()
  ]).then(() => {});
}

/**
 * Generate a promise to be resolved after a set period of time.
 * @param ms Time in which the promise should be resolved in milliseconds.
 * @returns Promise resolved after the specified number of milliseconds.
 */
function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function generateAdapterName({ name }: { name: string }) {
  return name === 'neeo-deviceadapter'
    ? name
    : `src-${validation.getUniqueName(name)}`;
}

function generateBaseUrl({ port }: { port: number }) {
  const baseUrl = `http://${validation.getAnyIpAddress()}:${port}`;
  debug('Adapter baseUrl %s', baseUrl);
  return baseUrl;
}

function buildDevicesDatabase(
  config: Models.StartServerConfig,
  adapterName: string
) {
  return new Database(
    config.devices.map(device => buildAndRegisterDevice(device, adapterName))
  );
}

function buildAndRegisterDevice(
  device: Models.DeviceBuilder,
  adapterName: string
) {
  if (!device || typeof device.build !== 'function') {
    throw new Error(
      `Invalid device detected! Check the ${adapterName} driver device exports.`
    );
  }
  const deviceModel = device.build(adapterName);
  const { subscriptionFunction, adapterName: deviceId } = deviceModel;
  if (subscriptionFunction) {
    const powerFunction = (value: boolean) => (uniqueDeviceId: string) => {
      return Brain.sendNotification(
        { uniqueDeviceId, component: 'powerstate', value },
        deviceId
      ).catch(error => {
        debug(`POWERO${value ? 'N' : 'FF'}_NOTIFICATION_FAILED`, error.message);
      });
    };

    subscriptionFunction(
      msg => {
        debug('notification %O', msg);
        return Brain.sendNotification(msg, deviceId);
      },
      !device.hasPowerStateSensor
        ? {}
        : {
            powerOnNotificationFunction: powerFunction(true),
            powerOffNotificationFunction: powerFunction(false)
          }
    );
  }
  return deviceModel;
}

function startSdkAndRetryIfConnectionFailed(
  conf: Models.StartServerConfig,
  adapterName: string,
  requestHandler: RequestHandler,
  baseUrl?: string,
  attemptCount = 1
): Promise<void> {
  const { brain, maxConnectionAttempts } = conf;
  const promises = [
    Brain.start({ brain, baseUrl, adapterName }),
    brainDriver.start(conf, requestHandler)
  ];
  return Promise.all(promises)
    .then(() => {}) // make void (easier done with async).
    .catch(error => {
      debug('ERROR: Could not connect to NEEO Brain %o', {
        attemptCount,
        error: error.message
      });
      if (attemptCount > maxConnectionAttempts!) {
        debug('maximal retry exceeded, fail now..');
        return Promise.reject(new Error('BRAIN_NOT_REACHABLE'));
      }
      return delay(attemptCount * 1000).then(() => {
        return startSdkAndRetryIfConnectionFailed(
          conf,
          adapterName,
          requestHandler,
          baseUrl,
          attemptCount + 1
        );
      });
    });
}

function validateBrainVersion(
  brain: string | Models.BrainModel,
  brainPort?: number
) {
  const urlPrefix = buildBrainUrl(brain, undefined, brainPort);
  return axios.get(`${urlPrefix}/systeminfo`).then(({ data }) => {
    const brainVersion = data.firmwareVersion;
    checkVersionSatisfaction(brainVersion);
  });
}

function checkVersionSatisfaction(brainVersion: string) {
  const { brainVersionSatisfaction } = config;
  const brainVersionSatisfied = satisfies(
    coerce(brainVersion)!,
    brainVersionSatisfaction
  );
  if (!brainVersionSatisfied) {
    throw new Error(
      `The Brain version must satisfy ${brainVersionSatisfaction}. Please make sure that the firmware is up-to-date.`
    );
  }
}

function fetchDeviceSubscriptionsIfNeeded(
  devices: ReadonlyArray<Models.DeviceBuilder>
) {
  const promises = devices.reduce(
    (output, device) => {
      const deviceHandlers = device.deviceSubscriptionHandlers;
      if (!!deviceHandlers) {
        debug('Initializing device subscriptions for %s', device.deviceName);
        output.push(
          Brain.getSubscriptions(device.deviceIdentifier).then(
            deviceHandlers.initializeDeviceList
          )
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
  Promise.all(promises).catch(error => {
    debug(
      'Initializing device subscriptions failed for at least one device',
      error.message
    );
  });
}
