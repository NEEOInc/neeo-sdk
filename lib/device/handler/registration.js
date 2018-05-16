'use strict';

const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:express:route:handler:registration');

module.exports.isRegistered = function(isRegisteredHandler) {
  return BluePromise.resolve(isRegisteredHandler())
    .then((registered) => {
      debug('isRegistered:', registered);
      return { registered };
    });
};

module.exports.register = function(registrationHandler, userdata) {
  return BluePromise.resolve(registrationHandler(userdata))
    .then((result) => {
      debug('Register result', result);
      return result;
    });
};
