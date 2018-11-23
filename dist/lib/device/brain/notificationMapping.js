"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BluePromise = require("bluebird");
var Debug = require("debug");
var REST_OPTIONS = { timeout: 8000 };
var debug = Debug('neeo:device:brain:BrainNotificationMapping');
function createRequestId(adapterName, uniqueDeviceId, deviceId) {
    return uniqueDeviceId + "-" + deviceId + "-" + adapterName;
}
var default_1 = (function () {
    function default_1(options) {
        debug('init %o', options);
        if (!options || !options.adapterName || !options.url) {
            throw new Error('INVALID_NOTIFICATIONMAPPING_PARAMETER');
        }
        var adapterName = options.adapterName, url = options.url;
        this.adapterName = adapterName;
        this.brainUri = url + "/v1/api/notificationkey/" + adapterName;
        this.cache = new Map();
    }
    default_1.prototype.getNotificationKeys = function (uniqueDeviceId, deviceId, componentName) {
        var _this = this;
        var id = createRequestId(this.adapterName, uniqueDeviceId, deviceId);
        if (this.cache.has(id)) {
            return this.findNotificationKeys(id, componentName);
        }
        return this.fetchDataFromBrain(uniqueDeviceId, deviceId, componentName).then(function (notificationKeys) {
            if (!Array.isArray(notificationKeys)) {
                return BluePromise.reject(new Error('INVALID_SERVER_RESPONSE'));
            }
            _this.cache.set(id, notificationKeys);
            return _this.findNotificationKeys(id, componentName);
        });
    };
    default_1.prototype.findNotificationKeys = function (id, componentName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var deviceDescription = _this.cache.get(id);
            var correctEntriesByName = deviceDescription.filter(function (entry) {
                return entry.eventKey && entry.name === componentName;
            });
            if (correctEntriesByName.length > 0) {
                var notificationKeys = mapToNotificationKeys(correctEntriesByName);
                return resolve(notificationKeys);
            }
            var correctEntriesByLabel = deviceDescription.filter(function (entry) {
                return entry.eventKey && entry.label === componentName;
            });
            if (correctEntriesByLabel.length) {
                var notificationKeys = mapToNotificationKeys(correctEntriesByLabel);
                return resolve(notificationKeys);
            }
            _this.cache.delete(id);
            reject(new Error('COMPONENTNAME_NOT_FOUND ' + componentName));
        });
    };
    default_1.prototype.fetchDataFromBrain = function (uniqueDeviceId, deviceId, componentName) {
        var _a = this, brainUri = _a.brainUri, adapterName = _a.adapterName;
        debug('getNotificationKey', componentName, uniqueDeviceId, adapterName, deviceId);
        var url = brainUri + "/" + deviceId + "/" + uniqueDeviceId;
        debug('GET request url', url);
        return axios_1.default.get(url, REST_OPTIONS).then(function (_a) {
            var data = _a.data;
            return data;
        });
    };
    return default_1;
}());
exports.default = default_1;
function mapToNotificationKeys(entries) {
    return entries.map(function (entry) { return entry.eventKey; });
}
//# sourceMappingURL=notificationMapping.js.map