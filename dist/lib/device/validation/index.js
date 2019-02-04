"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uniqueName_1 = require("./uniqueName");
exports.getUniqueName = uniqueName_1.default;
var buttonGroup_1 = require("./buttonGroup");
exports.getButtonGroup = buttonGroup_1.get;
var ipHelper_1 = require("./ipHelper");
exports.getAnyIpAddress = ipHelper_1.getAnyIpAddress;
var capability_1 = require("./capability");
exports.validateCapability = capability_1.getCapability;
var icon_1 = require("./icon");
exports.getIcon = icon_1.getIcon;
var deviceType_1 = require("./deviceType");
exports.getDeviceType = deviceType_1.getDeviceType;
exports.deviceTypeNeedsInputCommand = deviceType_1.needsInputCommand;
exports.deviceTypeDoesNotSupportTiming = deviceType_1.doesNotSupportTiming;
exports.deviceTypeHasFavoritesSupport = deviceType_1.hasFavoritesSupport;
exports.deviceTypeHasPlayerSupport = deviceType_1.hasPlayerSupport;
var inputMacroChecker_1 = require("./inputMacroChecker");
exports.hasNoInputButtonsDefined = inputMacroChecker_1.hasNoInputButtonsDefined;
var directoryRole_1 = require("./directoryRole");
exports.validateDirectoryRole = directoryRole_1.validate;
var discovery_1 = require("./discovery");
exports.validateDiscovery = discovery_1.validate;
var timing_1 = require("./timing");
exports.validateTiming = timing_1.validate;
var registrationType_1 = require("./registrationType");
exports.validateRegistrationType = registrationType_1.validate;
var playerWidget_1 = require("./playerWidget");
exports.validatePlayerWidget = playerWidget_1.validate;
exports.MAXIMAL_STRING_LENGTH = 48;
function stringLength(input, maxLength) {
    return !!input && !!maxLength && input.length <= maxLength;
}
exports.stringLength = stringLength;
function validateDriverVersion(version) {
    return Number.isInteger(version) && version > 0;
}
exports.validateDriverVersion = validateDriverVersion;
function checkLabelFor(_a, _b) {
    var label = _a.label;
    var _c = (_b === void 0 ? {} : _b).mandatory, mandatory = _c === void 0 ? false : _c;
    if (mandatory && !label) {
        throw new Error('MISSING_COMPONENT_LABEL');
    }
    if (!label) {
        return;
    }
    if (!stringLength(label, exports.MAXIMAL_STRING_LENGTH)) {
        throw new Error('LABEL_TOO_LONG_' + label);
    }
}
exports.checkLabelFor = checkLabelFor;
function checkNameFor(param) {
    if (!param || !param.name) {
        throw new Error('MISSING_ELEMENT_NAME');
    }
    if (!stringLength(param.name, exports.MAXIMAL_STRING_LENGTH)) {
        throw new Error('NAME_TOO_LONG_' + param.name);
    }
}
exports.checkNameFor = checkNameFor;
function checkNotYetDefined(component, componentName) {
    if (component) {
        throw new Error(componentName + "_ALREADY_DEFINED");
    }
}
exports.checkNotYetDefined = checkNotYetDefined;
function validateFunctionController(controller, componentName) {
    if (typeof controller !== 'function') {
        throw new Error("INVALID_CONTROLLER_FUNCTION_" + componentName);
    }
}
exports.validateFunctionController = validateFunctionController;
function validateController(controller, options) {
    var componentName = options.componentName ?
        " of " + options.componentName : '';
    if (!controller) {
        throw new Error("INVALID_" + options.handlerName + "_CONTROLLER" + componentName + " undefined");
    }
    var missingFunctions = options.requiredFunctions
        .filter(function (functionName) { return typeof controller[functionName] !== 'function'; });
    if (missingFunctions.length) {
        var functions = missingFunctions.join(', ');
        throw new Error("INVALID_" + options.handlerName + "_CONTROLLER" + componentName + " missing " + functions + " function(s)");
    }
}
exports.validateController = validateController;
//# sourceMappingURL=index.js.map