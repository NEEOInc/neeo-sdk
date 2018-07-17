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
  'VOD'
];

function isDeviceType(text: string): text is DeviceTypes {
  return TYPES.includes(text as DeviceTypes);
}

export function needsInputCommand(type: DeviceTypes) {
  switch (type) {
    case 'AVRECEIVER':
    case 'PROJECTOR':
    case 'TV':
      return true;
  }
  return false;
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
  throw new Error('INVALID_DEVICETYPE');
}
