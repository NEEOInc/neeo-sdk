'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:device');
const DeviceBuilder = require('./devicebuilder');
const Database = require('./db');
const Brain = require('./brain');
const handler = require('./handler');
const DeviceState = require('./implementationservices/devicestate');
const validation = require('./validation');

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

module.exports.startServer = function(conf, _brainDriver) {
  if (!conf || !conf.port || !conf.brain || !conf.name || !conf.devices || !_brainDriver) {
    return BluePromise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }

  brainDriver = _brainDriver;

  if (!conf.maxConnectionAttempts) {
    conf.maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
  }

  const adapterName = generateAdapterName(conf);
  const devicesDatabase = buildDevicesDatabase(conf, adapterName);
  const requestHandler = handler.build(devicesDatabase);
  const baseUrl = conf.baseurl || generateBaseUrl(conf);

  return startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl);
};

module.exports.stopServer = function(conf) {
  if (!conf || !conf.brain || !conf.name) {
    return BluePromise.reject(new Error('INVALID_STOPSERVER_PARAMETER'));
  }
  const adapterName = validation.getUniqueName(conf.name);
  return BluePromise.all([
    Brain.stop({ brain: conf.brain, adapterName }),
    brainDriver.stop(conf)
  ]);
};

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
  const devices = conf.devices.map((device) => {
    return buildAndRegisterDevice(device, adapterName);
  });
  return Database.build(devices);
}

function buildAndRegisterDevice(device, adapterName) {
  const deviceModel = device.build(adapterName);
  if (deviceModel.subscriptionFunction) {
    const boundNotificationFunction = (param) => {
      debug('notification %O', param);
      return Brain.sendNotification(param, deviceModel.adapterName);
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
        powerOffNotificationFunction
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
