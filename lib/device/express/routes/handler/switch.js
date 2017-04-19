'use strict';

const BluePromise = require('bluebird');

module.exports.switchGet = function(handler, deviceid) {
  return BluePromise.resolve(handler(deviceid))
    .then((result) => {
      return { value: result };
    });
};

module.exports.switchSet = function(handler, value, deviceid) {
  return BluePromise.resolve(handler(deviceid, value))
    .then(() => {
      return { success: true };
    });

};
