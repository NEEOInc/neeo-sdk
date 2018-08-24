'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:index');
const { get } = require('axios');
const { coerce, satisfies } = require('semver');

const config = require('../config');
const DeviceBuilder = require('./devicebuilder');
const Database = require('./db');
const Brain = require('./brain');
const handler = require('./handler');
const DeviceState = require('./implementationservices/devicestate');
const validation = require('./validation');
const Lists = require('./lists');
const { buildBrainUrl } = require('./brain/urlbuilder.js');

const MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN = 8;

let brainDriver;

module.exports.buildCustomDevice = function(adaptername, uniqueString) {
  if (!adaptername) {
    throw new Error('MISSING_ADAPTERNAME');
  }
  return new DeviceBuilder(adaptername, uniqueString);
};

module.exports.buildDeviceState = function() {
  return DeviceState.buildInstance();
};

module.exports.buildBrowseList = function(options) {
  return Lists.buildList(options);
};

module.exports.startServer = function(conf, _brainDriver) {
  if (!conf || !conf.port || !conf.brain || !conf.name || !conf.devices || !_brainDriver) {
    return BluePromise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }
  brainDriver = _brainDriver;

  if (!conf.maxConnectionAttempts) {
    conf.maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
  }

  const adapterName = generateAdapterName(conf);
  const baseUrl = conf.baseurl || generateBaseUrl(conf);

  return validateBrainVersion(conf.brain, conf.brainport)
    .then(() => buildDevicesDatabase(conf, adapterName)
    .then((devicesDatabase) => handler.build(devicesDatabase))
    .then((requestHandler) => {
      return startSdkAndRetryIfConnectionFailed(
        conf,
        adapterName,
        requestHandler,
        baseUrl
      );
    }))
    .then(() => fetchDeviceSubscriptionsIfNeeded(conf.devices));
};

module.exports.stopServer = function(conf) {
  if (!conf || !conf.brain || !conf.name) {
    return BluePromise.reject(new Error('INVALID_STOPSERVER_PARAMETER'));
  }
  const adapterName = validation.getUniqueName(conf.name);
  const stopDriverPromise = brainDriver ? brainDriver.stop(conf) : BluePromise.resolve();

  return BluePromise.all([
    Brain.stop({ brain: conf.brain, adapterName }),
    stopDriverPromise,
  ]);
};

/*
  Note: the unique name needs to start with "src-" to be recognised by the Brain
*/
function generateAdapterName(conf) {
  if (conf.name === 'neeo-deviceadapter') {
    return conf.name;
  }
  return 'src-' + validation.getUniqueName(conf.name);
}

function generateBaseUrl(conf) {
  const ipaddress = validation.getAnyIpAddress();
  const baseUrl = 'http://' + ipaddress + ':' + conf.port;
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

function buildAndRegisterDevice(device, adapterName) {
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
        return Brain.sendNotification(msg, deviceModel.adapterName)
          .catch((error) => { debug('POWERON_NOTIFICATION_FAILED', error.message); });
      };
      const powerOffNotificationFunction = (uniqueDeviceId) => {
        const msg = { uniqueDeviceId, component: 'powerstate', value: false };
        return Brain.sendNotification(msg, deviceModel.adapterName)
          .catch((error) => { debug('POWEROFF_NOTIFICATION_FAILED', error.message); });
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

function startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl, attemptCount = 1) {
  return BluePromise.all([
    Brain.start({ brain: conf.brain, brainport: conf.brainport, baseUrl, adapterName }),
    brainDriver.start(conf, requestHandler),
  ]).catch((error) => {
    debug('ERROR: Could not connect to NEEO Brain %o', { attemptCount, error: error.message });
    if (attemptCount > conf.maxConnectionAttempts) {
      debug('maximal retry exceeded, fail now..');
      return BluePromise.reject(new Error('BRAIN_NOT_REACHABLE'));
    }
    return BluePromise.delay(attemptCount * 1000)
      .then(() => {
        return startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl, attemptCount+1);
      });
  });
}

function validateBrainVersion(brain, brainport) {
  const urlPrefix = buildBrainUrl(brain, undefined, brainport);
  return get(`${urlPrefix}/systeminfo`).then((response) => {
    const brainVersion = response.data.firmwareVersion;
    checkVersionSatisfaction(brainVersion);
  });
}

function checkVersionSatisfaction(brainVersion) {
  const { brainVersionSatisfaction } = config;

  const brainVersionSatisfied = satisfies(
    coerce(brainVersion),
    brainVersionSatisfaction
  );

  if (!brainVersionSatisfied) {
    throw new Error(
      `The Brain version must satisfy ${brainVersionSatisfaction}. Please make sure that the firmware is up-to-date.`
    );
  }
}

function fetchDeviceSubscriptionsIfNeeded(devices) {
  const subscriptionPromises = devices
    .map((device) => {
      const deviceHandlers = device.deviceSubscriptionHandlers;
      const needsInitializeDeviceList = deviceHandlers;
      if (needsInitializeDeviceList) {
        debug('Initializing device subscriptions for %s', device.devicename);
        return Brain.getSubscriptions(device.deviceidentifier)
          .then(deviceHandlers.initializeDeviceList);
      }
    })
    .filter((promise) => promise);

  // do not wait until the subscription promises are finished
  BluePromise.all(subscriptionPromises)
    .catch((error) => {
      debug('Initializing device subscriptions failed for at least one device', error.message);
    });

  return;
}
