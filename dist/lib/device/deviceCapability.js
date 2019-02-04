"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Debug = require("debug");
var ComponentFactory = require("./componentFactory");
var debug = Debug('neeo:device:DeviceCapability');
var CAPABILITY_DYNAMIC_DEVICE = 'dynamicDevice';
var CAPABILITIES_REQUIRING_DISCOVERY = [
    'bridgeDevice',
    'addAnotherDevice',
    'register-user-account',
];
function buildDeviceCapabilities(deviceBuilder) {
    if (!deviceBuilder || typeof deviceBuilder !== 'object') {
        throw new Error('INVALID_PARAMETERS');
    }
    var emptyObject = Object.keys(deviceBuilder).length === 0;
    if (emptyObject) {
        throw new Error('EMPTY_OBJECT');
    }
    var buttons = deviceBuilder.buttons, sliders = deviceBuilder.sliders, switches = deviceBuilder.switches, textLabels = deviceBuilder.textLabels, imageUrls = deviceBuilder.imageUrls, sensors = deviceBuilder.sensors, deviceCapabilities = deviceBuilder.deviceCapabilities, devicename = deviceBuilder.devicename, deviceSubscriptionHandlers = deviceBuilder.deviceSubscriptionHandlers, directories = deviceBuilder.directories, discovery = deviceBuilder.discovery, favoritesHandler = deviceBuilder.favoritesHandler, registration = deviceBuilder.registration, deviceidentifier = deviceBuilder.deviceidentifier, buttonHandler = deviceBuilder.buttonHandler;
    var capabilities = [];
    var pathPrefix = "/device/" + deviceidentifier + "/";
    var isUniquePath = function (path) {
        return undefined === capabilities.find(function (element) { return element.path === path; });
    };
    var handlers = new Map();
    function addCapability(capability, controller) {
        var type = capability.type, path = capability.path, name = capability.name;
        debug('register capability', devicename, type, path);
        if (isUniquePath(path)) {
            capabilities.push(capability);
            handlers.set(decodeURIComponent(name), {
                componenttype: type,
                controller: controller,
            });
            return;
        }
        debug('path is not unique', name, type, path);
        throw new Error("DUPLICATE_PATH_DETECTED: " + capability.name);
    }
    function addRouteHandler(capability, controller) {
        var type = capability.type, path = capability.path, name = capability.name;
        debug('register route', type, path);
        if (isUniquePath(path)) {
            handlers.set(decodeURIComponent(name), {
                componenttype: type,
                controller: controller,
            });
            return;
        }
        debug('path is not unique', name, type, path);
        throw new Error("DUPLICATE_PATH_DETECTED: " + capability.name);
    }
    buttons.forEach(function (_a) {
        var param = _a.param;
        return addCapability(ComponentFactory.buildButton(pathPrefix, param), buttonHandler.bind(undefined, param.name));
    });
    sliders.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        addCapability(ComponentFactory.buildSensor(pathPrefix, tslib_1.__assign({}, param, { type: ComponentFactory.SENSOR_TYPE_RANGE })), controller);
        addCapability(ComponentFactory.buildRangeSlider(pathPrefix, param), controller);
    });
    switches.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        addCapability(ComponentFactory.buildSensor(pathPrefix, tslib_1.__assign({}, param, { type: ComponentFactory.SENSOR_TYPE_BINARY })), controller);
        addCapability(ComponentFactory.buildSwitch(pathPrefix, param), controller);
    });
    textLabels.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        addCapability(ComponentFactory.buildSensor(pathPrefix, {
            name: param.name,
            label: param.label,
            type: ComponentFactory.SENSOR_TYPE_STRING,
        }), controller);
        addCapability(ComponentFactory.buildTextLabel(pathPrefix, param), controller);
    });
    imageUrls.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        addCapability(ComponentFactory.buildSensor(pathPrefix, {
            name: param.name,
            label: param.label,
            type: ComponentFactory.SENSOR_TYPE_STRING,
        }), controller);
        addCapability(ComponentFactory.buildImageUrl(pathPrefix, param), controller);
    });
    directories.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        addCapability(ComponentFactory.buildDirectory(pathPrefix, param), controller);
    });
    sensors.forEach(function (_a) {
        var param = _a.param, controller = _a.controller;
        return addCapability(ComponentFactory.buildSensor(pathPrefix, param), controller);
    });
    var noDiscovery = true;
    discovery.forEach(function (_a) {
        var controller = _a.controller;
        addRouteHandler(ComponentFactory.buildDiscovery(pathPrefix), controller);
        noDiscovery = false;
    });
    var discoveryRequired = CAPABILITIES_REQUIRING_DISCOVERY.some(function (capability) {
        return deviceCapabilities.includes(capability);
    });
    var isNotDynamicDevice = !deviceBuilder.deviceCapabilities
        .includes(CAPABILITY_DYNAMIC_DEVICE);
    if (discoveryRequired && noDiscovery && isNotDynamicDevice) {
        var discoveryRequiredFor = CAPABILITIES_REQUIRING_DISCOVERY.join(', ');
        throw new Error('DISCOVERY_REQUIRED ' + discoveryRequiredFor + ' require discovery');
    }
    registration.forEach(function (_a) {
        var controller = _a.controller;
        addRouteHandler(ComponentFactory.buildRegister(pathPrefix), controller);
    });
    if (deviceSubscriptionHandlers) {
        addRouteHandler(ComponentFactory.buildDeviceSubscription(pathPrefix), deviceSubscriptionHandlers);
    }
    if (favoritesHandler) {
        addRouteHandler(ComponentFactory.buildFavoritesHandler(pathPrefix), favoritesHandler);
    }
    return {
        capabilities: capabilities,
        handlers: handlers,
    };
}
exports.buildDeviceCapabilities = buildDeviceCapabilities;
//# sourceMappingURL=deviceCapability.js.map