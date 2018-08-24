'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:express:route:handler:directory');

module.exports.directoryGet = function(handler, deviceid, params) {
  return BluePromise.resolve(handler(deviceid, params))
    .then((browseResult) => {
      if (!browseResult) {
        const error = new Error('DIRECTORY_NO_BROWSERESULT_RETURNED_FROM_GETTER');
        debug(error);
        throw error;
      }

      return browseResult;
    });
};

module.exports.callAction = function(handler, deviceid, params) {
  return BluePromise.resolve(handler(deviceid, params));
};
