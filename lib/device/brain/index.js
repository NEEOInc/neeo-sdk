'use strict';

const BluePromise = require('bluebird');
const BrainRegister = require('./register.js');
const BrainNotification = require('./notification.js');
const BrainNotificationMapping = require('./notificationMapping.js');
const debug = require('debug')('neeo:device:brain:BrainIndex');

const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';
let brainNotification;
let brainNotificationMapping;

function buildBrainUrl(brain) {
  return PROTOCOL + (brain.host || brain) + ':' + (brain.port || DEFAULT_BRAIN_PORT);
}

module.exports.start = function(conf) {
  if (!conf || !conf.brain || !conf.baseUrl || !conf.adapterName) {
    return BluePromise.reject(new Error('BRAIN_INVALID_PARAMETER_REGISTER'));
  }
  const urlPrefix = buildBrainUrl(conf.brain);
  brainNotification = new BrainNotification({ url: urlPrefix });
  brainNotificationMapping = new BrainNotificationMapping({ url: urlPrefix, adapterName: conf.adapterName });
  return BrainRegister.registerAdapterOnTheBrain({ url: urlPrefix, baseUrl: conf.baseUrl, adapterName: conf.adapterName });
};

module.exports.stop = function(conf) {
  if (!conf || !conf.brain || !conf.adapterName) {
    return BluePromise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
  }
  const urlPrefix = buildBrainUrl(conf.brain);
  brainNotification = null;
  brainNotificationMapping = null;
  return BrainRegister.unregisterAdapterOnTheBrain({ url: urlPrefix, adapterName: conf.adapterName });
};

module.exports.sendNotification = function(msg, deviceId) {
  if (!brainNotification) {
    debug('server not started, ignore notification');
    return BluePromise.reject(new Error('SERVER_NOT_STARTED'));
  }
  if (!msg || !msg.uniqueDeviceId || !msg.component || !deviceId || (typeof msg.value === 'undefined')) {
    debug('INVALID_NOTIFICATION_DATA %o', msg);
    return BluePromise.reject(new Error('INVALID_NOTIFICATION_DATA'));
  }

  return brainNotificationMapping.getNotificationKey(msg.uniqueDeviceId, deviceId, msg.component)
    .then((notificationKey) => {
      debug('notificationKey %o', notificationKey);
      const notificationData = { type: notificationKey, data: msg.value };
      return brainNotification.send(notificationData);
    }).catch((error) => {
      debug('failed to send notification', error.message);
    });
};
