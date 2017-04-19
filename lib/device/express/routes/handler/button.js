'use strict';

const BluePromise = require('bluebird');

module.exports.trigger = function(deviceid, handler) {
  return BluePromise.resolve(handler(deviceid))
    .then(() => {
      return { success: true };
    });
};
