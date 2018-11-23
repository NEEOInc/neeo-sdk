"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluePromise = require("bluebird");
var Debug = require("debug");
var debug = Debug('neeo:device:express:route:handler:discover');
function validateDevices(devices) {
    return devices.every(function (device) {
        if (!(device instanceof Object) && !Array.isArray(device)) {
            return false;
        }
        if (!device.hasOwnProperty('id')) {
            return false;
        }
        if (!device.hasOwnProperty('name')) {
            return false;
        }
        return true;
    });
}
function uniqueDeviceIdCheck(devices) {
    var uniqueIds = Object.keys(devices.reduce(function (reduced, device) {
        reduced[device.id] = device.name;
        return reduced;
    }, {}));
    return uniqueIds.length === devices.length;
}
function run(handler, registerDiscoveredDeviceFunction, optionalDeviceId) {
    return BluePromise.resolve(handler(optionalDeviceId)).then(function (discoveredDevicesArray) {
        if (optionalDeviceId && !Array.isArray(discoveredDevicesArray) && discoveredDevicesArray) {
            debug('single device detected, wrap it into array');
            discoveredDevicesArray = [discoveredDevicesArray];
        }
        if (!Array.isArray(discoveredDevicesArray)) {
            debug('Discovery result invalid, not an array', typeof discoveredDevicesArray);
            return BluePromise.reject(new Error('INVALID_DISCOVERY_ANSWER_NOT_AN_ARRAY'));
        }
        if (!validateDevices(discoveredDevicesArray)) {
            debug('Discovery result invalid, invalid device data');
            return BluePromise.reject(new Error('INVALID_DISCOVERY_ITEM_DATA'));
        }
        if (!uniqueDeviceIdCheck(discoveredDevicesArray)) {
            debug('Discovery result invalid, duplicate device ids');
            return BluePromise.reject(new Error('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS'));
        }
        return discoveredDevicesArray.map(function (discoveredDevice) {
            var isDeviceBuildFunctionValid = discoveredDevice.device && typeof discoveredDevice.device.build === 'function';
            debug('discovered brain %s, isDeviceBuildFunctionValid %s', discoveredDevice.name, isDeviceBuildFunctionValid);
            var result = {
                id: discoveredDevice.id,
                name: discoveredDevice.name,
            };
            var device = isDeviceBuildFunctionValid ? discoveredDevice.device.build() : undefined;
            if (device) {
                result.device = device;
                debug('register discovered device', discoveredDevice.id);
                registerDiscoveredDeviceFunction(discoveredDevice.id, device);
            }
            if (typeof discoveredDevice.reachable !== 'undefined') {
                result.reachable = discoveredDevice.reachable;
            }
            if (typeof discoveredDevice.room !== 'undefined') {
                result.room = discoveredDevice.room;
            }
            return result;
        });
    });
}
exports.run = run;
//# sourceMappingURL=discover.js.map