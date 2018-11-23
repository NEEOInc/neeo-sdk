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
var inputMacroChecker_1 = require("./inputMacroChecker");
exports.hasNoInputButtonsDefined = inputMacroChecker_1.hasNoInputButtonsDefined;
var directoryRole_1 = require("./directoryRole");
exports.validateDirectoryRole = directoryRole_1.validate;
var registrationType_1 = require("./registrationType");
exports.validateRegistrationType = registrationType_1.validate;
function stringLength(input, maxLength) {
    return !!input && !!maxLength && input.length <= maxLength;
}
exports.stringLength = stringLength;
function validateDriverVersion(version) {
    return Number.isInteger(version) && version > 0;
}
exports.validateDriverVersion = validateDriverVersion;
//# sourceMappingURL=index.js.map