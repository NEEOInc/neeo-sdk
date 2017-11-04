'use strict';

const uniqueName = require('./uniqueName.js');
const buttongroup = require('./buttongroup.js');
const iphelper = require('./iphelper.js');

module.exports.getUniqueName = function(string, _uniqeString) {
  return uniqueName(string, _uniqeString);
};

module.exports.getButtonGroup = function(name) {
  return buttongroup.get(name);
};

module.exports.getAnyIpAddress = function() {
  return iphelper.getAnyIpAddress();
};
