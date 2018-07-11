'use strict';

const CAPABILITY = [
  'alwaysOn',
  'bridgeDevice',
  'addAnotherDevice',
  'groupVolume',
];

module.exports.getCapability = function(capability) {
  if (CAPABILITY.includes(capability)) {
    return capability;
  }
  throw new Error('INVALID_CAPABILITY');
};
