'use strict';

const TYPES = [
  'ACCESSOIRE',
  'AVRECEIVER',
  'DVB',
  'DVD',
  'GAMECONSOLE',
  'LIGHT',
  'MEDIAPLAYER',
  'PROJECTOR',
  'TV',
  'VOD'
];

function isDefaultDeviceType(type) {
  return TYPES.indexOf(type.toUpperCase()) >= 0;
}

module.exports.getDeviceType = function(type) {
  if (isDefaultDeviceType(type)) {
    return type.toUpperCase();
  }
  if (type === 'ACCESSORY') {
    return 'ACCESSOIRE';
  }
  throw new Error('INVALID_DEVICETYPE');
};

module.exports.needsInputCommand = function(type) {
  return ['AVRECEIVER', 'TV', 'PROJECTOR'].includes(type);
};

module.exports.doesNotSupportTiming = function(type) {
  return ['ACCESSOIRE', 'LIGHT'].includes(type);
};
