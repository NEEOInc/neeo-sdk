const CAPABILITIES = [
  'alwaysOn',
  'bridgeDevice',
  'dynamicDevice',
  'addAnotherDevice',
  'groupVolume',
];

export function getCapability(capability: string) {
  if (CAPABILITIES.includes(capability)) {
    return capability;
  }
  throw new Error('INVALID_CAPABILITY');
}
