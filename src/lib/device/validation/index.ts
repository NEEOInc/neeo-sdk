export { default as getUniqueName } from './uniqueName';
export { get as getButtonGroup } from './buttonGroup';
export { getAnyIpAddress } from './ipHelper';
export { getCapability as validateCapability } from './capability';
export { getIcon } from './icon';
export {
  getDeviceType,
  needsInputCommand as deviceTypeNeedsInputCommand,
  doesNotSupportTiming as deviceTypeDoesNotSupportTiming,
  hasFavoritesSupport as deviceTypeHasFavoritesSupport,
  hasPlayerSupport as deviceTypeHasPlayerSupport,
} from './deviceType';
export { hasNoInputButtonsDefined } from './inputMacroChecker';
export { validate as validateDirectoryRole } from './directoryRole';
export { validate as validateDiscovery } from './discovery';
export { validate as validateTiming } from './timing';
export { validate as validateRegistrationType } from './registrationType';
export { validate as validatePlayerWidget } from './playerWidget';

export const MAXIMAL_STRING_LENGTH = 48;

interface ValidationOptions {
  requiredFunctions: string[];
  handlerName: string;
  componentName?: string;
}

export {
  checkLabelFor,
  checkNameFor,
  checkNotYetDefined,
  stringLength,
  validateDriverVersion,
  validateFunctionController,
  validateController,
};

function stringLength(input: string, maxLength: number) {
  return !!input && !!maxLength && input.length <= maxLength;
}

function validateDriverVersion(version: number) {
  return Number.isInteger(version) && version > 0;
}

function checkLabelFor({ label }: { label?: string }, { mandatory = false } = {}) {
  if (mandatory && !label) {
    throw new Error('MISSING_COMPONENT_LABEL');
  }
  if (!label) {
    return;
  }
  if (!stringLength(label, MAXIMAL_STRING_LENGTH)) {
    throw new Error('LABEL_TOO_LONG_' + label);
  }
}

function checkNameFor(param?: { name?: string }) {
  if (!param || !param.name) {
    throw new Error('MISSING_ELEMENT_NAME');
  }
  if (!stringLength(param.name, MAXIMAL_STRING_LENGTH)) {
    throw new Error('NAME_TOO_LONG_' + param.name);
  }
}

function checkNotYetDefined(component: any, componentName: string) {
  if (component) {
    throw new Error(`${componentName}_ALREADY_DEFINED`);
  }
}

function validateFunctionController(controller: any, componentName: string) {
  if (typeof controller !== 'function') {
    throw new Error(`INVALID_CONTROLLER_FUNCTION_${componentName}`);
  }
}

function validateController(controller: any, options: ValidationOptions) {
  const componentName = options.componentName ?
    ` of ${options.componentName}` : '';

  if (!controller) {
    throw new Error(`INVALID_${options.handlerName}_CONTROLLER${componentName} undefined`);
  }

  const missingFunctions = options.requiredFunctions
    .filter((functionName) => typeof controller[functionName] !== 'function');

  if (missingFunctions.length) {
    const functions = missingFunctions.join(', ');
    throw new Error(
      `INVALID_${options.handlerName}_CONTROLLER${componentName} missing ${functions} function(s)`
    );
  }
}
