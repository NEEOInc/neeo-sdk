import { DeviceTypes } from '../../models/deviceTypes';

const TYPES: DeviceTypes[] = [
  'ACCESSOIRE',
  'AVRECEIVER',
  'DVB',
  'DVD',
  'GAMECONSOLE',
  'LIGHT',
  'MEDIAPLAYER',
  'MUSICPLAYER',
  'PROJECTOR',
  'TV',
  'VOD',
  'HDMISWITCH',
  'TUNER',
];

function isDeviceType(text: string): text is DeviceTypes {
  return TYPES.includes(text as DeviceTypes);
}

export function needsInputCommand(type: DeviceTypes) {
  return ['AVRECEIVER', 'TV', 'PROJECTOR', 'HDMISWITCH'].includes(type);
}

export function doesNotSupportTiming(type: DeviceTypes) {
  switch (type) {
    case 'ACCESSOIRE':
    case 'LIGHT':
      return true;
  }
  return false;
}

export function getDeviceType(type: string) {
  const upperCase = type.toUpperCase();
  if (isDeviceType(upperCase)) {
    return upperCase;
  }
  if (upperCase === 'ACCESSORY') {
    return 'ACCESSOIRE';
  }
  throw new Error('INVALID_DEVICETYPE_' + type);
}
