"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Debug = require("debug");
var http = require("http");
var httpAgent = new http.Agent({
    maxSockets: 1,
    keepAlive: true,
    keepAliveMsecs: 16000,
});
var debug = Debug('neeo:device:brain:BrainNotification');
var MAXIMAL_CACHED_ENTRIES = 80;
var MAXIMAL_MESSAGE_QUEUE_SIZE = 20;
var timeout = 8000;
var DEVICE_SENSOR_UPDATE_TYPE = 'DEVICE_SENSOR_UPDATE';
var default_1 = (function () {
    function default_1(options) {
        debug('init', options);
        this.queueSize = 0;
        this.brainUri = options.url + "/v1/notifications";
        this.sensorValues = new Map();
    }
    default_1.prototype.send = function (message) {
        var _this = this;
        if (!message) {
            debug('empty notification ignored');
            return Promise.reject(new Error('EMPTY_MESSAGE'));
        }
        if (this.isDuplicateMessage(message)) {
            debug('DUPLICATE_MESSAGE');
            return Promise.reject(new Error('DUPLICATE_MESSAGE'));
        }
        var _a = this, queueSize = _a.queueSize, brainUri = _a.brainUri;
        if (queueSize >= MAXIMAL_MESSAGE_QUEUE_SIZE) {
            debug('MAX_QUEUESIZE_REACHED', MAXIMAL_MESSAGE_QUEUE_SIZE);
            return Promise.reject(new Error('MAX_QUEUESIZE_REACHED'));
        }
        debug('POST: %o', message, brainUri);
        this.queueSize++;
        return axios_1.default
            .post(brainUri, message, { httpAgent: httpAgent, timeout: timeout })
            .then(function (_a) {
            var data = _a.data;
            _this.updateCache(message);
            _this.decreaseQueueSize();
            return data;
        })
            .catch(function (error) {
            debug('failed to send notification', error.message);
            _this.decreaseQueueSize();
        });
    };
    default_1.prototype.decreaseQueueSize = function () {
        if (this.queueSize > 0) {
            this.queueSize--;
        }
    };
    default_1.prototype.isDuplicateMessage = function (message) {
        if (this.empty(message)) {
            return false;
        }
        var _a = this.extractTypeAndData(message), type = _a.type, data = _a.data;
        var lastSensorValue = this.sensorValues.get(type);
        return lastSensorValue === data;
    };
    default_1.prototype.updateCache = function (message) {
        if (this.empty(message)) {
            return;
        }
        var _a = this.extractTypeAndData(message), type = _a.type, data = _a.data;
        var sensorValues = this.sensorValues;
        if (sensorValues.size > MAXIMAL_CACHED_ENTRIES) {
            debug('clear message cache');
            this.sensorValues.clear();
        }
        sensorValues.set(type, data);
    };
    default_1.prototype.empty = function (message) {
        return !message || !message.type || typeof message.data === 'undefined';
    };
    default_1.prototype.extractTypeAndData = function (message) {
        if (message.type === DEVICE_SENSOR_UPDATE_TYPE) {
            var data = message.data;
            return { type: data.sensorEventKey, data: data.sensorValue };
        }
        return { type: message.type, data: message.data };
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=notification.js.map