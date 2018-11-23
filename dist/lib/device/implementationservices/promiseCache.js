"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var debug = Debug('neeo:promisecache');
var default_1 = (function () {
    function default_1(cacheDurationMs, uniqueIdentifier) {
        if (cacheDurationMs === void 0) { cacheDurationMs = 10000; }
        if (uniqueIdentifier === void 0) { uniqueIdentifier = String(Date.now()); }
        this.cacheDurationMs = cacheDurationMs;
        this.uniqueIdentifier = uniqueIdentifier;
        this.cacheExpire = 0;
    }
    default_1.prototype.getValue = function (getPromiseFunction) {
        var _a = this, uniqueIdentifier = _a.uniqueIdentifier, cacheDurationMs = _a.cacheDurationMs, existingPromise = _a.promise, cacheExpire = _a.cacheExpire;
        var now = Date.now();
        if (existingPromise && now < cacheExpire) {
            debug('use cache', uniqueIdentifier);
            return existingPromise;
        }
        if (!getPromiseFunction) {
            throw new Error('NO_CALLBACK_FUNCTION_DEFINED');
        }
        debug('requested new data', uniqueIdentifier);
        var newPromise = getPromiseFunction();
        this.promise = newPromise;
        this.cacheExpire = now + cacheDurationMs;
        return newPromise;
    };
    default_1.prototype.invalidate = function () {
        debug('invalidate cache');
        this.cacheExpire = 0;
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=promiseCache.js.map