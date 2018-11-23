"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Debug = require("debug");
var debug = Debug('neeo:device:ComponentFactory');
var TYPE_BUTTON = 'button';
var TYPE_SWITCH = 'switch';
var TYPE_SLIDER = 'slider';
var TYPE_SENSOR = 'sensor';
var TYPE_TEXTLABEL = 'textlabel';
var TYPE_IMAGEURL = 'imageurl';
var TYPE_DIRECTORY = 'directory';
var TYPE_DISCOVER_ROUTE = 'discover';
var TYPE_REGISTER_ROUTE = 'register';
var TYPE_DEVICE_SUBSCRIPTION_ROUTE = 'devicesubscription';
exports.SENSOR_TYPE_ARRAY = 'array';
exports.SENSOR_TYPE_BINARY = 'binary';
exports.SENSOR_TYPE_CUSTOM = 'custom';
exports.SENSOR_TYPE_POWER = 'power';
exports.SENSOR_TYPE_RANGE = 'range';
exports.SENSOR_TYPE_STRING = 'string';
var SENSOR_SUFFIX = '_SENSOR';
var SENSOR_DEFAULT_TYPE = exports.SENSOR_TYPE_RANGE;
var SENSOR_TYPES = [
    exports.SENSOR_TYPE_ARRAY,
    exports.SENSOR_TYPE_BINARY,
    exports.SENSOR_TYPE_CUSTOM,
    exports.SENSOR_TYPE_POWER,
    exports.SENSOR_TYPE_RANGE,
    exports.SENSOR_TYPE_STRING,
];
var SLIDER_TYPE_RANGE = 'range';
var SLIDER_DEFAULT_RANGE = [0, 100];
var SLIDER_DEFAULT_UNIT = '%';
var VALID_IMAGEURL_SIZES = ['small', 'large'];
function validateParameter(pathPrefix, param) {
    if (!pathPrefix) {
        throw new Error('INVALID_PATHPREFIX');
    }
    if (!param || !param.name) {
        throw new Error('INVALID_BUILD_PARAMETER');
    }
}
function buildButton(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    var label = param.label ? encodeURIComponent(param.label) : name;
    return {
        type: TYPE_BUTTON,
        name: name,
        label: label,
        path: path,
    };
}
exports.buildButton = buildButton;
function buildDirectory(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    return {
        type: TYPE_DIRECTORY,
        label: encodeURIComponent(param.label || ''),
        name: name,
        path: path,
        role: param.role,
        identifier: param.identifier,
    };
}
exports.buildDirectory = buildDirectory;
function buildSwitch(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    return {
        type: TYPE_SWITCH,
        name: name,
        label: encodeURIComponent(param.label || ''),
        path: path,
        sensor: getSensorNameIfNeeded(name),
    };
}
exports.buildSwitch = buildSwitch;
function validateRange(param) {
    var range = param || SLIDER_DEFAULT_RANGE;
    if (!range || !Array.isArray(range)) {
        throw new Error("INVALID_SLIDER_RANGE " + JSON.stringify(range) + ", range must be an array");
    }
    if (range.length !== 2 || typeof range[0] !== 'number' || typeof range[1] !== 'number') {
        throw new Error("INVALID_SLIDER_RANGE: " + JSON.stringify(range) + ", range must include 2 numbers");
    }
    return range;
}
function buildPowerSensor(pathPrefix, param) {
    var component = buildSensorHelper(pathPrefix, param, exports.SENSOR_TYPE_POWER);
    var legacyNoSuffixName = encodeURIComponent(param.name);
    component.name = legacyNoSuffixName;
    component.path = pathPrefix + legacyNoSuffixName;
    return component;
}
function buildSensor(pathPrefix, param) {
    if (param.type === exports.SENSOR_TYPE_POWER) {
        return buildPowerSensor(pathPrefix, param);
    }
    if (param.type && SENSOR_TYPES.includes(param.type)) {
        return buildSensorHelper(pathPrefix, param, param.type);
    }
    return buildLegacyFallbackSensor(pathPrefix, param);
}
exports.buildSensor = buildSensor;
function buildRangeSlider(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    var range = validateRange(param.range);
    var unit = param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT;
    var label = param.label ? encodeURIComponent(param.label) : name;
    return {
        type: TYPE_SLIDER,
        name: name,
        label: label,
        path: path,
        slider: {
            type: SLIDER_TYPE_RANGE,
            sensor: getSensorNameIfNeeded(name),
            range: range,
            unit: unit,
        },
    };
}
exports.buildRangeSlider = buildRangeSlider;
function buildSensorHelper(pathPrefix, param, type) {
    if (type === void 0) { type = SENSOR_DEFAULT_TYPE; }
    validateParameter(pathPrefix, param);
    var name = getSensorNameIfNeeded(encodeURIComponent(param.name));
    var path = pathPrefix + name;
    var label = encodeURIComponent(param.sensorlabel || param.label || param.name);
    if (type === exports.SENSOR_TYPE_CUSTOM) {
        debug('Warning: sensor of type custom is not recommended.', param.name);
    }
    var component = {
        type: TYPE_SENSOR,
        name: name,
        label: label,
        path: path,
        sensor: tslib_1.__assign({ type: type }, (type === exports.SENSOR_TYPE_RANGE
            ? {
                range: validateRange(param.range),
                unit: param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT,
            }
            : {})),
    };
    return component;
}
function buildLegacyFallbackSensor(pathPrefix, param) {
    debug('Warning: no type for sensor %s, using default. ' +
        'This fallback will be removed in a future version.', param.name);
    var component = buildSensorHelper(pathPrefix, param, exports.SENSOR_TYPE_RANGE);
    var legacyNoSuffixName = encodeURIComponent(param.name);
    component.name = legacyNoSuffixName;
    component.path = pathPrefix + legacyNoSuffixName;
    return component;
}
function buildTextLabel(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    var label = param.label ? encodeURIComponent(param.label) : name;
    return {
        type: TYPE_TEXTLABEL,
        name: name,
        label: label,
        path: path,
        sensor: getSensorNameIfNeeded(name),
        isLabelVisible: param.isLabelVisible,
    };
}
exports.buildTextLabel = buildTextLabel;
function validateImageSize(size) {
    if (!VALID_IMAGEURL_SIZES.includes(size)) {
        throw new Error('INVALID_IMAGEURL_SIZE');
    }
}
function buildImageUrl(pathPrefix, param) {
    validateParameter(pathPrefix, param);
    var name = encodeURIComponent(param.name);
    var path = pathPrefix + name;
    var imageUri = param.uri || null;
    var label = param.label ? encodeURIComponent(param.label) : name;
    var size = param.size || 'large';
    if (!param.size) {
        debug('warning, no size definition found for image, use large');
    }
    validateImageSize(size);
    return {
        type: TYPE_IMAGEURL,
        name: name,
        label: label,
        imageUri: imageUri,
        size: size,
        path: path,
        sensor: getSensorNameIfNeeded(name),
    };
}
exports.buildImageUrl = buildImageUrl;
function buildDiscovery(pathPrefix) {
    return getRouteFor(pathPrefix, TYPE_DISCOVER_ROUTE);
}
exports.buildDiscovery = buildDiscovery;
function buildRegister(pathPrefix) {
    return getRouteFor(pathPrefix, TYPE_REGISTER_ROUTE);
}
exports.buildRegister = buildRegister;
function buildDeviceSubscription(pathPrefix) {
    return getRouteFor(pathPrefix, TYPE_DEVICE_SUBSCRIPTION_ROUTE);
}
exports.buildDeviceSubscription = buildDeviceSubscription;
function getRouteFor(pathPrefix, route) {
    if (!pathPrefix) {
        throw new Error('INVALID_PATHPREFIX');
    }
    var path = pathPrefix + route;
    return {
        type: route,
        name: route,
        path: path,
    };
}
function getSensorNameIfNeeded(name) {
    var alreadySensorName = name.endsWith(SENSOR_SUFFIX);
    if (alreadySensorName) {
        return name;
    }
    return name.toUpperCase() + SENSOR_SUFFIX;
}
//# sourceMappingURL=componentFactory.js.map