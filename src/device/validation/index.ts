export { default as getUniqueName } from './uniqueName';
export { default as getButtonGroup } from './buttonGroup';
export { getAnyIpAddress } from './ipHelper';
export { getCapability as validateCapability } from './capability';
export { getIcon } from './icon';
export {
  getDeviceType,
  needsInputCommand as deviceTypeNeedsInputCommand,
  doesNotSupportTiming as deviceTypeDoesNotSupportTiming
} from './deviceType';
export { hasNoInputButtonsDefined } from './inputMacroChecker';

export function stringLength(string: string, maxLength: number) {
  return !!string && !!maxLength && string.length <= maxLength;
}
