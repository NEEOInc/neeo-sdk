'use strict';

const ExpressServer = require('./server');

module.exports.start = function(conf, requestHandler) {
  if (!requestHandler) {
    throw new Error('INVALID_REQUEST_HANDLER');
  }
  return ExpressServer.startExpress(conf, requestHandler);
};

module.exports.stop = function(conf) {
  return ExpressServer.stopExpress(conf);
};
