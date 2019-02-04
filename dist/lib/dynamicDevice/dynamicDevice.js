"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var COMPONENTS = require("./components");
exports.COMPONENTS = COMPONENTS;
var debug = Debug('neeo:dynamicdevice:dynamicdevice');
var REQUEST_DTO_DYNAMICADAPTER = 'dynamicAdapter';
var requestHandler;
function registerHandler(inputRequestHandler) {
    requestHandler = inputRequestHandler;
}
exports.registerHandler = registerHandler;
function storeDataInRequest(req, adapterName, component) {
    req[REQUEST_DTO_DYNAMICADAPTER] = {
        adapterName: adapterName,
        component: component,
    };
}
exports.storeDataInRequest = storeDataInRequest;
function storeDiscoveryHandlerInRequest(req) {
    var dynamicAdapter = req[REQUEST_DTO_DYNAMICADAPTER];
    debug('dynamically fetch handler %s: %o', req.deviceid, dynamicAdapter);
    var handler = requestHandler.getDiscoveredDeviceComponentHandler(req.deviceid, dynamicAdapter.component);
    if (handler) {
        req.handler = handler;
        return Promise.resolve(handler);
    }
    return askDeviceDiscoverForDeviceInstance(req).then(function () {
        handler = requestHandler.getDiscoveredDeviceComponentHandler(req.deviceid, dynamicAdapter.component);
        req.handler = handler;
        return handler;
    });
}
exports.storeDiscoveryHandlerInRequest = storeDiscoveryHandlerInRequest;
function askDeviceDiscoverForDeviceInstance(req) {
    debug('askDeviceDiscoverForDeviceInstance', req.deviceid);
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_DISCOVER_COMPONENT);
    if (!handler) {
        debug('NO_DISCOVER_COMPONENT_FOUND');
        return Promise.reject(new Error('NO_DISCOVER_COMPONENT_FOUND'));
    }
    return requestHandler.discover(handler, req.deviceid);
}
function validateDeviceIdRoute(req) {
    if (!req.deviceid) {
        debug('MISSING_DEVICEID');
        return false;
    }
    if (req.handler) {
        return true;
    }
    var dynamicAdapter = req[REQUEST_DTO_DYNAMICADAPTER];
    if (dynamicAdapter) {
        return true;
    }
    debug('dynamicAdapter not found');
    return false;
}
exports.validateDeviceIdRoute = validateDeviceIdRoute;
//# sourceMappingURL=dynamicDevice.js.map