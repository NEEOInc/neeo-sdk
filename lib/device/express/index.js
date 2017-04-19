'use strict';

const Express = require('./server');

module.exports.start = function(conf) {
  return Express.startExpress(conf);
};

module.exports.stop = function(conf) {
  return Express.stopExpress(conf);
};

module.exports.registerDeviceRoute = function(device) {
  return Express.registerDeviceRoute(device);
};
