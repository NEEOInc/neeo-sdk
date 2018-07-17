const CAPABILITIES = ['alwaysOn', 'bridgeDevice'];

export function getCapability(name: string) {
  if (!CAPABILITIES.includes(name)) {
    throw new Error('INVALID_CAPABILITY');
  }
  return name;
}
