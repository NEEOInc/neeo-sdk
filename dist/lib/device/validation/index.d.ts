export { default as getUniqueName } from './uniqueName';
export { get as getButtonGroup } from './buttonGroup';
export { getAnyIpAddress } from './ipHelper';
export { getCapability as validateCapability } from './capability';
export { getIcon } from './icon';
export { getDeviceType, needsInputCommand as deviceTypeNeedsInputCommand, doesNotSupportTiming as deviceTypeDoesNotSupportTiming, hasFavoritesSupport as deviceTypeHasFavoritesSupport, hasPlayerSupport as deviceTypeHasPlayerSupport, } from './deviceType';
export { hasNoInputButtonsDefined } from './inputMacroChecker';
export { validate as validateDirectoryRole } from './directoryRole';
export { validate as validateDiscovery } from './discovery';
export { validate as validateTiming } from './timing';
export { validate as validateRegistrationType } from './registrationType';
export { validate as validatePlayerWidget } from './playerWidget';
export declare const MAXIMAL_STRING_LENGTH = 48;
interface ValidationOptions {
    requiredFunctions: string[];
    handlerName: string;
    componentName?: string;
}
export { checkLabelFor, checkNameFor, checkNotYetDefined, stringLength, validateDriverVersion, validateFunctionController, validateController, };
declare function stringLength(input: string, maxLength: number): boolean;
declare function validateDriverVersion(version: number): boolean;
declare function checkLabelFor({ label }: {
    label?: string;
}, { mandatory }?: {
    mandatory?: boolean;
}): void;
declare function checkNameFor(param?: {
    name?: string;
}): void;
declare function checkNotYetDefined(component: any, componentName: string): void;
declare function validateFunctionController(controller: any, componentName: string): void;
declare function validateController(controller: any, options: ValidationOptions): void;
