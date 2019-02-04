import { DeviceType } from '../../models/deviceType';

const TYPES: DeviceType[] = [
  'ACCESSOIRE',
  'AUDIO',
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
  'SOUNDBAR',
  'TUNER',
];

const FAVORITES_SUPPORT_TYPES: DeviceType[] = [
  'TV',
  'DVB',
  'TUNER',
];

const PLAYER_SUPPORT_TYPES: DeviceType[] = [
  'MEDIAPLAYER',
  'MUSICPLAYER',
  'VOD',
];

function isDeviceType(text: string): text is DeviceType {
  return TYPES.includes(text as DeviceType);
}

export function needsInputCommand(type: DeviceType) {
  return ['AVRECEIVER', 'TV', 'PROJECTOR', 'HDMISWITCH', 'SOUNDBAR'].includes(type);
}

export function doesNotSupportTiming(type: DeviceType) {
  switch (type) {
    case 'ACCESSOIRE':
    case 'LIGHT':
      return true;
  }
  return false;
}

export function hasFavoritesSupport(type: DeviceType) {
  return FAVORITES_SUPPORT_TYPES.includes(type);
}

export function hasPlayerSupport(type: DeviceType) {
  return PLAYER_SUPPORT_TYPES.includes(type);
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
