'use strict';

const RequestHandler = require('./RequestHandler');

module.exports.build = function(deviceDatabase) {
  return new RequestHandler(deviceDatabase);
};
