'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:express:route:handler:discover');

module.exports.run = function(handler) {
  return BluePromise.resolve(handler())
    .then((res) => {
      if (Array.isArray(res)) {
        //check for id and name
        return res;
      }
      debug('Discovery result invalid, not an array');
      return BluePromise.reject(new Error('INVALID_DISCOVERY_ANSWER'));
    });
};
