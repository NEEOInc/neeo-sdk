'use strict';

const BluePromise = require('bluebird');

module.exports.sliderGet = function(handler, deviceid) {
  return BluePromise.resolve(handler(deviceid))
    .then((value) => {
      //TODO check for type?
      return { value };
    });
};

module.exports.sliderSet = function(handler, value, deviceid) {
  return BluePromise.resolve(handler(deviceid, value))
    .then(() => {
      return { success: true };
    });

};
