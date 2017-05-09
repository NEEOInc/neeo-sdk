'use strict';

// currently the supported devicetypes are very restrictive, will be enhanced soon
const TYPES = [
  'ACCESSOIRE',
  'LIGHT',
  'MEDIAPLAYER'
];

function isDefaultDeviceType(type) {
  return TYPES.indexOf(type.toUpperCase()) >= 0;
}

module.exports.getDeviceType = function(type) {
  if (isDefaultDeviceType(type)) {
    return type.toUpperCase();
  }
  throw new Error('INVALID_DEVICETYPE');
};
