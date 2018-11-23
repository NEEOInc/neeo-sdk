"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BluePromise = require("bluebird");
var Debug = require("debug");
var debug = Debug('neeo:device:brain:BrainDeviceSubscriptions');
var REST_OPTIONS = { timeout: 8000 };
var RETRY_DELAY_MS = 2500;
var MAX_RETRIES = 2;
var BrainDeviceSubscriptions = (function () {
    function BrainDeviceSubscriptions(options) {
        debug('init %o', options);
        if (!options) {
            throw new Error('INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER');
        }
        var adapterName = options.adapterName, url = options.url;
        if (!adapterName || !url) {
            throw new Error('INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER');
        }
        this.adapterName = adapterName;
        this.subscriptionsUri = url + "/v1/api/subscriptions/" + adapterName + "/";
        this.cache = new Map();
    }
    BrainDeviceSubscriptions.build = function (options) {
        return new BrainDeviceSubscriptions(options);
    };
    BrainDeviceSubscriptions.prototype.getSubscriptions = function (deviceId) {
        var _a = this, adapterName = _a.adapterName, subscriptionsUri = _a.subscriptionsUri;
        debug('GET_DEVICE_SUBSCRIPTIONS %s/%s', adapterName, deviceId);
        return retryWithDelay(function () { return axios_1.default.get(subscriptionsUri + deviceId, REST_OPTIONS); }, MAX_RETRIES, RETRY_DELAY_MS).then(function (response) { return response.data; });
    };
    return BrainDeviceSubscriptions;
}());
exports.default = BrainDeviceSubscriptions;
function retryWithDelay(action, retryCount, retryDelay) {
    if (retryCount === void 0) { retryCount = MAX_RETRIES; }
    return action().catch(function (error) {
        if (retryCount > 0) {
            debug('getSubscription error %s, retry in %s', error.message, retryDelay);
            return BluePromise.delay(retryDelay).then(function () {
                return retryWithDelay(action, retryCount - 1, retryDelay);
            });
        }
        debug('getSubscription failed on last retry %s', error.message);
        return BluePromise.reject(error);
    });
}
//# sourceMappingURL=deviceSubscriptions.js.map