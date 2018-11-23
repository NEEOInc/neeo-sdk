"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluePromise = require("bluebird");
var Debug = require("debug");
var config_1 = require("../../config");
var deviceSubscriptions_1 = require("./deviceSubscriptions");
var notification_1 = require("./notification");
var notificationMapping_1 = require("./notificationMapping");
var BrainRegister = require("./register");
var urlBuilder_1 = require("./urlBuilder");
var debug = Debug('neeo:device:brain:BrainIndex');
var brainNotification;
var brainNotificationMapping;
var brainDeviceSubscriptions;
function start(conf) {
    var brainport = conf.brainport, baseUrl = conf.baseUrl;
    var brainConfig = {
        url: urlBuilder_1.default(conf.brain, undefined, brainport),
        baseUrl: baseUrl,
        adapterName: conf.adapterName,
    };
    brainDeviceSubscriptions = deviceSubscriptions_1.default.build(brainConfig);
    brainNotification = new notification_1.default(brainConfig);
    brainNotificationMapping = new notificationMapping_1.default(brainConfig);
    return BrainRegister.registerAdapterOnTheBrain(brainConfig);
}
exports.start = start;
function stop(conf) {
    if (!conf) {
        return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
    }
    var brain = conf.brain, adapterName = conf.adapterName;
    if (!brain || !adapterName) {
        return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
    }
    var urlPrefix = urlBuilder_1.default(brain);
    brainNotification = undefined;
    brainNotificationMapping = undefined;
    return BrainRegister.unregisterAdapterOnTheBrain({
        url: urlPrefix,
        adapterName: adapterName,
    });
}
exports.stop = stop;
function sendNotification(msg, deviceId) {
    return sendBrainNotification(msg, deviceId);
}
exports.sendNotification = sendNotification;
function sendSensorNotification(msg, deviceId) {
    return sendBrainNotification(msg, deviceId, config_1.default.sensorUpdateKey);
}
exports.sendSensorNotification = sendSensorNotification;
function getSubscriptions(deviceId) {
    return brainDeviceSubscriptions
        ? brainDeviceSubscriptions.getSubscriptions(deviceId)
        : Promise.reject('Not started');
}
exports.getSubscriptions = getSubscriptions;
function sendBrainNotification(msg, deviceId, overrideKey) {
    if (!brainNotification || !brainNotificationMapping) {
        debug('server not started, ignore notification');
        return Promise.reject(new Error('SERVER_NOT_STARTED'));
    }
    if (!deviceId ||
        !msg ||
        !msg.uniqueDeviceId ||
        !msg.component ||
        typeof msg.value === 'undefined') {
        debug('INVALID_NOTIFICATION_DATA %o', msg);
        return Promise.reject(new Error('INVALID_NOTIFICATION_DATA'));
    }
    if (msg.raw) {
        return brainNotification.send(msg);
    }
    return brainNotificationMapping
        .getNotificationKeys(msg.uniqueDeviceId, deviceId, msg.component)
        .then(function (notificationKeys) {
        debug('notificationKeys %o', notificationKeys);
        var notificationPromises = notificationKeys.map(function (notificationKey) {
            var notificationData = formatNotification(msg.value, notificationKey, overrideKey);
            return brainNotification && brainNotification.send(notificationData);
        });
        return BluePromise.all(notificationPromises);
    });
}
function formatNotification(data, notificationKey, overrideKey) {
    if (overrideKey) {
        return {
            type: overrideKey,
            data: {
                sensorEventKey: notificationKey,
                sensorValue: data,
            },
        };
    }
    return { type: notificationKey, data: data };
}
//# sourceMappingURL=index.js.map