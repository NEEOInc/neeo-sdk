import { DeviceStaticCapability } from '../../models/deviceCapability';

const CAPABILITIES: DeviceStaticCapability[] = [
  'addAnotherDevice',
  'alwaysOn',
  'bridgeDevice',
  'dynamicDevice',
  'groupVolume',
];

export function getCapability(capability: DeviceStaticCapability) {
  if (CAPABILITIES.includes(capability)) {
    return capability;
  }
  throw new Error('INVALID_CAPABILITY: ' + capability);
}
