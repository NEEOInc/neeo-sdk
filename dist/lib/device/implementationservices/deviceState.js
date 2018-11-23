"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var promiseCache_1 = require("./promiseCache");
var default_1 = (function () {
    function default_1(cacheTimeMs) {
        if (cacheTimeMs === void 0) { cacheTimeMs = 2000; }
        this.cacheTimeMs = cacheTimeMs;
        this.deviceMap = new Map();
    }
    default_1.prototype.addDevice = function (id, clientObject, reachable) {
        if (reachable === void 0) { reachable = true; }
        var _a = this, cacheTimeMs = _a.cacheTimeMs, deviceMap = _a.deviceMap, stateChangeCallback = _a.stateChangeCallback;
        deviceMap.set(id, {
            clientObject: clientObject,
            promiseCache: new promiseCache_1.default(cacheTimeMs, "NPC-" + id),
            reachable: reachable,
        });
        if (stateChangeCallback) {
            stateChangeCallback(id, clientObject);
        }
    };
    default_1.prototype.registerStateUpdate = function (callback) {
        if (typeof callback !== 'function') {
            throw new Error('STATEUPDATE_CALLBACK_IS_NOT_A_FUNCTION');
        }
        if (this.stateChangeCallback) {
            throw new Error('STATEUPDATE_ONLY_ONE_CALLBACK_ALLOWED');
        }
        this.stateChangeCallback = callback;
    };
    default_1.prototype.getAllDevices = function () {
        var deviceMap = this.deviceMap;
        return Array.from(deviceMap.entries()).map(function (_a) {
            var id = _a[0], entry = _a[1];
            return tslib_1.__assign({ id: id }, entry);
        });
    };
    default_1.prototype.isDeviceRegistered = function (id) {
        return this.deviceMap.has(id);
    };
    default_1.prototype.isReachable = function (id) {
        var entry = this.deviceMap.get(id);
        return !!entry && entry.reachable;
    };
    default_1.prototype.getClientObjectIfReachable = function (id) {
        var entry = this.deviceMap.get(id);
        return entry && entry.reachable ? entry.clientObject : undefined;
    };
    default_1.prototype.getCachePromise = function (id) {
        var entry = this.deviceMap.get(id);
        return entry ? entry.promiseCache : Promise.reject(new Error('INVALID_ID'));
    };
    default_1.prototype.updateReachable = function (id, reachable) {
        var entry = this.deviceMap.get(id);
        if (entry && typeof reachable === 'boolean') {
            entry.reachable = reachable;
        }
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=deviceState.js.map