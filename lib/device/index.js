'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:device');
const DeviceBuilder = require('./devicebuilder');
const ExpressServer = require('./express');
const Database = require('./db');
const Brain = require('./brain');
const uniqueName = require('./uniqueName.js');
const iphelper = require('./iphelper.js');

const MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN = 8;

let db;

module.exports.buildCustomDevice = function(adaptername, uniqeString) {
  if (!adaptername) {
    throw new Error('MISSING_ADAPTERNAME');
  }
  return new DeviceBuilder(adaptername, uniqeString);
};

module.exports.searchDevice = function(query) {
  if (!db) {
    debug('server not started');
    return;
  }
  return db.search(query);
};

module.exports.getDevice = function(id) {
  if (!db) {
    debug('server not started');
    return;
  }
  return db.getDevice(id);
};

function registerDevice(device) {
  Database.register(device);
  ExpressServer.registerDeviceRoute(device);
}

function buildDevices(conf) {
  const adapterName = 'src-'+uniqueName(conf.name);
  conf.devices.forEach((device) => {
    const deviceModel = device.build(adapterName);
    if (deviceModel.subscriptionFunction) {
      const boundNotificationFunction = function(param) {
        return Brain.sendNotification(param, deviceModel.adapterName);
      };
      deviceModel.subscriptionFunction(boundNotificationFunction);
    }
    registerDevice(deviceModel);
  });
  db = Database.build();
  return adapterName;
}


function startSdkAndRetryIfConnectionFailed(conf, adapterName, baseUrl, attemptCount) {
  attemptCount = attemptCount || 1;
  return BluePromise.all([
    Brain.start({ brain: conf.brain, baseUrl, adapterName }),
    ExpressServer.start(conf),
  ]).catch((error) => {
    debug('ERROR: Could not connect to NEEO Brain %o', { attemptCount, error: error.message });
    if (attemptCount > conf.maxConnectionAttempts) {
      debug('maximal retry exceeded, fail now..');
      return BluePromise.reject(new Error('BRAIN_NOT_REACHABLE'));
    }
    return BluePromise.delay(attemptCount * 1000)
      .then(() => {
        return startSdkAndRetryIfConnectionFailed(conf, adapterName, baseUrl, attemptCount+1);
      });
  });
}

module.exports.startServer = function(conf) {
  if (!conf || !conf.port || !conf.brain || !conf.name || !conf.devices) {
    return BluePromise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
  }

  if (!conf.maxConnectionAttempts) {
    conf.maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
  }

  const adapterName = buildDevices(conf);
  const ipaddress = iphelper.getAnyIpAddress();
  const baseUrl = 'http://' + ipaddress + ':' + conf.port;
  debug('Adapter baseUrl %s', baseUrl);
  return startSdkAndRetryIfConnectionFailed(conf, adapterName, baseUrl);
};

module.exports.stopServer = function(conf) {
  if (!conf || !conf.brain || !conf.name) {
    return BluePromise.reject(new Error('INVALID_STOPSERVER_PARAMETER'));
  }
  const adapterName = uniqueName(conf.name);
  return BluePromise.all([
    Brain.stop({ brain: conf.brain, adapterName }),
    ExpressServer.stop(conf)
  ]);
};
