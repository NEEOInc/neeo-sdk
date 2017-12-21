'use strict';

const uniqueName = require('./uniqueName.js');
const buttongroup = require('./buttongroup.js');
const iphelper = require('./iphelper.js');
const Capability = require('./capability.js');
const devicetype = require('./devicetype.js');
const inputMacroChecker = require('./inputMacroChecker.js');

module.exports.getUniqueName = function(string, _uniqueString) {
  return uniqueName(string, _uniqueString);
};

module.exports.getButtonGroup = function(name) {
  return buttongroup.get(name);
};

module.exports.getAnyIpAddress = function() {
  return iphelper.getAnyIpAddress();
};

module.exports.validateCapability = function(capability) {
  return Capability.getCapability(capability);
};

module.exports.getDeviceType = function(type) {
  return devicetype.getDeviceType(type);
};

module.exports.deviceTypeNeedsInputCommand = function(type) {
  return devicetype.needsInputCommand(type);
};

module.exports.deviceTypeDoesNotSupportTiming = function(type) {
  return devicetype.doesNotSupportTiming(type);
};

module.exports.hasNoInputButtonsDefined = function(buttons) {
  return inputMacroChecker.hasNoInputButtonsDefined(buttons);
};
