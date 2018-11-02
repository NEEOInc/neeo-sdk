export { default as getUniqueName } from './uniqueName';
export { get as getButtonGroup } from './buttonGroup';
export { getAnyIpAddress } from './ipHelper';
export { getCapability as validateCapability } from './capability';
export { getIcon } from './icon';
export {
  getDeviceType,
  needsInputCommand as deviceTypeNeedsInputCommand,
  doesNotSupportTiming as deviceTypeDoesNotSupportTiming,
} from './deviceType';
export { hasNoInputButtonsDefined } from './inputMacroChecker';
export { validate as validateDirectoryRole } from './directoryRole';
export { validate as validateRegistrationType } from './registrationType';

export function stringLength(input: string, maxLength: number) {
  return !!input && !!maxLength && input.length <= maxLength;
}

export function validateDriverVersion(version: number) {
  return Number.isInteger(version) && version > 0;
}
