"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var button = require("./button");
var deviceSubscriptions = require("./deviceSubscriptions");
var directory = require("./directory");
var discover = require("./discover");
var imageUrl = require("./imageUrl");
var register = require("./registration");
var slider = require("./slider");
var onOff = require("./switch");
var textLabel = require("./textLabel");
var debug = Debug('neeo:device:RequestHandler');
var SUCCESS = { success: true };
var RequestHandler = (function () {
    function RequestHandler(deviceDatabase) {
        this.deviceDatabase = deviceDatabase;
        if (!deviceDatabase) {
            throw new Error('INVALID_DEVICE_DATABASE');
        }
        this.deviceDatabase = deviceDatabase;
        this.discoveredDynamicDevices = new Map();
    }
    RequestHandler.build = function (deviceDatabase) {
        return new RequestHandler(deviceDatabase);
    };
    RequestHandler.prototype.searchDevice = function (query) {
        return this.deviceDatabase.search(query);
    };
    RequestHandler.prototype.getDevice = function (id) {
        return this.deviceDatabase.getDevice(id);
    };
    RequestHandler.prototype.getAdapterDefinition = function (adapterName) {
        return this.deviceDatabase.getAdapterDefinition(adapterName);
    };
    RequestHandler.prototype.getDeviceByAdapterId = function (adapterId) {
        return this.deviceDatabase.getDeviceByAdapterId(adapterId);
    };
    RequestHandler.prototype.registerDiscoveredDevice = function (deviceId, device) {
        this.discoveredDynamicDevices.set(deviceId, device);
        debug('added device, db size:', this.discoveredDynamicDevices.size);
    };
    RequestHandler.prototype.getDiscoveredDeviceComponentHandler = function (deviceId, componentName) {
        var device = this.discoveredDynamicDevices.get(deviceId);
        if (!device) {
            return;
        }
        return device.handler.get(componentName);
    };
    RequestHandler.prototype.discover = function (handler, optionalDeviceId) {
        var _this = this;
        if (!handler || !handler.controller) {
            return Promise.reject(new Error('INVALID_DISCOVER_PARAMETER'));
        }
        var handlerFunction = handler.controller;
        return checkForFunction(handlerFunction).then(function () {
            return discover.run(handlerFunction, _this.registerDiscoveredDevice.bind(_this), optionalDeviceId);
        });
    };
    RequestHandler.prototype.isRegistered = function (handler) {
        debug('isRegistered?');
        if (!handler || !handler.controller) {
            return Promise.reject(new Error('INVALID_REGISTERED_HANDLER'));
        }
        var handlerFunction = handler.controller
            .isRegistered;
        return checkForFunction(handlerFunction).then(function () { return register.isRegistered(handlerFunction); });
    };
    RequestHandler.prototype.register = function (handler, userdata) {
        debug('register');
        if (!handler || !handler.controller) {
            return Promise.reject(new Error('INVALID_REGISTER_HANDLER'));
        }
        var handlerFunction = handler.controller
            .register;
        return checkForFunction(handlerFunction).then(function () {
            return register.register(handlerFunction, userdata);
        });
    };
    RequestHandler.prototype.handleAction = function (device) {
        if (deviceIsInvalid(device)) {
            debug('handleraction failed %o', device);
            return Promise.reject(new Error('INVALID_ACTION_PARAMETER'));
        }
        var componenttype = device.handler.componenttype, deviceid = device.deviceid, params = device.body;
        var handlerFunction;
        debug('process action request for', componenttype);
        switch (componenttype) {
            case 'directory':
                handlerFunction = device.handler.controller
                    .action;
                return checkForFunction(handlerFunction).then(function (handler) {
                    return directory.callAction(handler, deviceid, params);
                });
            default:
                debug('INVALID_ACTION_COMPONENT %o', { component: componenttype });
                return Promise.reject(new Error("INVALID_ACTION_COMPONENT: " + componenttype));
        }
    };
    RequestHandler.prototype.handleGet = function (device) {
        if (deviceIsInvalid(device)) {
            debug('handlerget failed %o', device);
            return Promise.reject(new Error('INVALID_GET_PARAMETER'));
        }
        var deviceid = device.deviceid, _a = device.handler, componenttype = _a.componenttype, controller = _a.controller, params = device.body;
        debug('process get request for', componenttype);
        debug('deviceId: ', deviceid);
        switch (componenttype) {
            case 'button':
                return checkForFunction(controller).then(function (handler) {
                    return button.trigger(deviceid, handler);
                });
            case 'textlabel':
                return checkForFunction(controller).then(function (handler) {
                    return textLabel.getText(handler, deviceid);
                });
            case 'imageurl':
                return checkForFunction(controller).then(function (handler) {
                    return imageUrl.getImageUri(handler, deviceid);
                });
            case 'sensor':
            case 'slider':
                return checkForFunction(controller.getter).then(function (handler) {
                    return slider.sliderGet(handler, deviceid);
                });
            case 'switch':
                return checkForFunction(controller.getter).then(function (handler) {
                    return onOff.switchGet(handler, deviceid);
                });
            case 'directory':
                return checkForFunction(controller.getter).then(function (handler) {
                    return directory.directoryGet(handler, deviceid, params);
                });
        }
        debug('INVALID_GET_COMPONENT %o', { component: componenttype });
        return Promise.reject(new Error('INVALID_GET_COMPONENT'));
    };
    RequestHandler.prototype.handleSet = function (device) {
        if (deviceIsInvalid(device)) {
            debug('handlerset failed %o', device);
            return Promise.reject(new Error('INVALID_SET_PARAMETER'));
        }
        var deviceid = device.deviceid, _a = device.handler, componenttype = _a.componenttype, controller = _a.controller, value = device.value;
        debug('process set request for', componenttype, value);
        switch (componenttype) {
            case 'slider':
                return checkForFunction(controller.setter).then(function (handler) {
                    return slider.sliderSet(handler, value, deviceid);
                });
            case 'switch':
                return checkForFunction(controller.setter).then(function (handler) {
                    return onOff.switchSet(handler, value === 'true', deviceid);
                });
        }
        debug('INVALID_SET_COMPONENT %o', { component: componenttype });
        return Promise.reject(new Error('INVALID_SET_COMPONENT'));
    };
    RequestHandler.prototype.subscribe = function (handler, deviceId) {
        if (!handler || !handler.controller) {
            return Promise.resolve(SUCCESS);
        }
        var handlerFunction = handler.controller
            .deviceAdded;
        return checkForFunction(handlerFunction).then(function (fn) {
            return deviceSubscriptions.deviceAdded(fn, deviceId);
        });
    };
    RequestHandler.prototype.unsubscribe = function (handler, deviceId) {
        if (!handler || !handler.controller) {
            return Promise.resolve(SUCCESS);
        }
        var handlerFunction = handler.controller
            .deviceRemoved;
        return checkForFunction(handlerFunction).then(function (fn) {
            return deviceSubscriptions.deviceRemoved(fn, deviceId);
        });
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;
function deviceIsInvalid(device) {
    return !device || !device.handler || !device.handler.componenttype || !device.handler.controller;
}
function checkForFunction(func) {
    return new Promise(function (resolve, reject) {
        return typeof func !== 'function'
            ? reject(new Error('CONTROLLER_IS_NOT_A_FUNCTION'))
            : resolve(func);
    });
}
//# sourceMappingURL=requestHandler.js.map