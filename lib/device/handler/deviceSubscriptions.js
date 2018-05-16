'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:express:route:handler:devicesubscription');

const SUCCESS = { success: true };

module.exports.deviceAdded = function(handler, deviceId) {
  debug('device added:', deviceId);
  return BluePromise.resolve(handler(deviceId))
    .then(() => SUCCESS);
};

module.exports.deviceRemoved = function(handler, deviceId) {
  debug('device removed:', deviceId);
  return BluePromise.resolve(handler(deviceId))
    .then(() => SUCCESS);
};
