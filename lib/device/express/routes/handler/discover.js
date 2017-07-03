'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:express:route:handler:discover');

function validateDevices(devices) {
  return devices.every((device) => {
    if (!(device instanceof Object) && !Array.isArray(device)) { return false; }
    if (!device.hasOwnProperty('id')) { return false; }
    if (!device.hasOwnProperty('name')) { return false; }
    return true;
  });
}

function uniqueDeviceIdCheck(devices) {
  const uniqueIds = Object.keys(devices.reduce((reduced, device) => {
    reduced[device.id] = device.name;
    return reduced;
  }, {}));
  return (uniqueIds.length === devices.length);
}

module.exports.run = function(handler) {
  return BluePromise.resolve(handler())
    .then((res) => {
      if (!Array.isArray(res)) {
        debug('Discovery result invalid, not an array');
        return BluePromise.reject(new Error('INVALID_DISCOVERY_ANSWER'));
      }

      if (!validateDevices(res)) {
        debug('Discovery result invalid, invalid device data');
        return BluePromise.reject(new Error('INVALID_DISCOVERY_ITEM_DATA'));
      }

      if (!uniqueDeviceIdCheck(res)) {
        debug('Discovery result invalid, duplicate device ids');
        return BluePromise.reject(new Error('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS'));
      }

      return res;
    });
};
