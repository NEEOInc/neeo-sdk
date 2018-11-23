"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BluePromise = require("bluebird");
var Debug = require("debug");
var semver_1 = require("semver");
var config_1 = require("../config");
var Brain = require("./brain");
var urlBuilder_1 = require("./brain/urlBuilder");
var database_1 = require("./database");
var deviceBuilder_1 = require("./deviceBuilder");
var requestHandler_1 = require("./handler/requestHandler");
var deviceState_1 = require("./implementationservices/deviceState");
var listBuilder_1 = require("./lists/listBuilder");
var validation = require("./validation");
var MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN = 8;
var brainDriver;
var debug = Debug('neeo:device:device');
var buildDevice = buildCustomDevice;
exports.buildDevice = buildDevice;
function buildCustomDevice(adapterName, uniqueString) {
    if (!adapterName) {
        throw new Error('MISSING_ADAPTERNAME');
    }
    return new deviceBuilder_1.DeviceBuilder(adapterName, uniqueString);
}
exports.buildCustomDevice = buildCustomDevice;
function buildBrowseList(options) {
    return new listBuilder_1.default(options);
}
exports.buildBrowseList = buildBrowseList;
function buildDeviceState(cacheTimeMs) {
    return new deviceState_1.default(cacheTimeMs);
}
exports.buildDeviceState = buildDeviceState;
function startServer(conf, driver) {
    if (!conf || !driver) {
        return BluePromise.reject(new Error('INVALID_STARTSERVER_PARAMETER'));
    }
    var maxConnectionAttempts = conf.maxConnectionAttempts;
    var baseurl = conf.baseurl, brain = conf.brain, brainport = conf.brainport;
    brainDriver = driver;
    if (!maxConnectionAttempts) {
        maxConnectionAttempts = MAXIMAL_CONNECTION_ATTEMPTS_TO_BRAIN;
    }
    var adapterName = generateAdapterName(conf);
    var baseUrl = baseurl || generateBaseUrl(conf);
    return validateBrainVersion(brain, brainport)
        .then(function () { return buildDevicesDatabase(conf, adapterName); })
        .then(function (devicesDatabase) { return requestHandler_1.RequestHandler.build(devicesDatabase); })
        .then(function (requestHandler) {
        return startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl);
    })
        .then(function () { return fetchDeviceSubscriptionsIfNeeded(conf.devices); });
}
exports.startServer = startServer;
function stopServer(conf) {
    if (!conf || !conf.brain || !conf.name) {
        return BluePromise.reject('INVALID_STOPSERVER_PARAMETER');
    }
    var adapterName = validation.getUniqueName(conf.name);
    var stopDriver = brainDriver ? brainDriver.stop(conf) : Promise.resolve();
    return Promise.all([Brain.stop({ brain: conf.brain, adapterName: adapterName }), stopDriver]);
}
exports.stopServer = stopServer;
function generateAdapterName(_a) {
    var name = _a.name;
    return name === 'neeo-deviceadapter' ? name : "src-" + validation.getUniqueName(name);
}
function generateBaseUrl(_a) {
    var port = _a.port;
    var baseUrl = "http://" + validation.getAnyIpAddress() + ":" + port;
    debug('Adapter baseUrl %s', baseUrl);
    return baseUrl;
}
function buildDevicesDatabase(conf, adapterName) {
    return new BluePromise(function (resolve) {
        var devices = conf.devices.map(function (device) {
            return buildAndRegisterDevice(device, adapterName);
        });
        resolve(database_1.Database.build(devices));
    });
}
function buildAndRegisterDevice(device, adapterName) {
    if (!device || typeof device.build !== 'function') {
        throw new Error("Invalid device detected! Check the " + adapterName + " driver device exports.");
    }
    var deviceModel = device.build(adapterName);
    if (deviceModel.subscriptionFunction) {
        var boundNotificationFunction = function (param) {
            debug('notification %o', param);
            return Brain.sendSensorNotification(param, deviceModel.adapterName);
        };
        var optionalCallbacks = {};
        if (device.hasPowerStateSensor) {
            var powerOnNotificationFunction = function (uniqueDeviceId) {
                var msg = { uniqueDeviceId: uniqueDeviceId, component: 'powerstate', value: true };
                return Brain.sendNotification(msg, deviceModel.adapterName).catch(function (error) {
                    debug('POWERON_NOTIFICATION_FAILED', error.message);
                });
            };
            var powerOffNotificationFunction = function (uniqueDeviceId) {
                var msg = { uniqueDeviceId: uniqueDeviceId, component: 'powerstate', value: false };
                return Brain.sendNotification(msg, deviceModel.adapterName).catch(function (error) {
                    debug('POWEROFF_NOTIFICATION_FAILED', error.message);
                });
            };
            optionalCallbacks = {
                powerOnNotificationFunction: powerOnNotificationFunction,
                powerOffNotificationFunction: powerOffNotificationFunction,
            };
        }
        deviceModel.subscriptionFunction(boundNotificationFunction, optionalCallbacks);
    }
    return deviceModel;
}
function startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl, attemptCount) {
    if (attemptCount === void 0) { attemptCount = 1; }
    var brain = conf.brain, brainport = conf.brainport, maxConnectionAttempts = conf.maxConnectionAttempts;
    return brainDriver
        .start(conf, requestHandler)
        .then(function () { return Brain.start({ brain: brain, brainport: brainport, baseUrl: baseUrl, adapterName: adapterName }); })
        .catch(function (error) {
        debug('ERROR: Could not connect to NEEO Brain %o', {
            attemptCount: attemptCount,
            error: error.message,
        });
        if (maxConnectionAttempts && attemptCount > maxConnectionAttempts) {
            debug('maximal retry exceeded, fail now..');
            return BluePromise.reject(new Error('BRAIN_NOT_REACHABLE'));
        }
        return BluePromise.delay(attemptCount * 1000).then(function () {
            return startSdkAndRetryIfConnectionFailed(conf, adapterName, requestHandler, baseUrl, attemptCount + 1);
        });
    });
}
function validateBrainVersion(brain, brainPort) {
    var urlPrefix = urlBuilder_1.default(brain, undefined, brainPort);
    return axios_1.default.get(urlPrefix + "/systeminfo").then(function (_a) {
        var data = _a.data;
        var brainVersion = data.firmwareVersion;
        checkVersionSatisfaction(brainVersion);
    });
}
function checkVersionSatisfaction(brainVersion) {
    var brainVersionSatisfaction = config_1.default.brainVersionSatisfaction;
    var brainVersionSatisfied = semver_1.satisfies(semver_1.coerce(brainVersion), brainVersionSatisfaction);
    if (!brainVersionSatisfied) {
        throw new Error("The Brain version must satisfy " + brainVersionSatisfaction + ". Please make sure that the firmware is up-to-date.");
    }
}
function fetchDeviceSubscriptionsIfNeeded(devices) {
    var promises = devices.reduce(function (output, device) {
        var deviceHandlers = device.deviceSubscriptionHandlers;
        if (deviceHandlers) {
            debug('Initializing device subscriptions for %s', device.devicename);
            output.push(Brain.getSubscriptions(device.deviceidentifier).then(deviceHandlers.initializeDeviceList));
        }
        return output;
    }, []);
    if (!promises.length) {
        return;
    }
    Promise.all(promises).catch(function (error) {
        debug('Initializing device subscriptions failed for at least one device', error.message);
    });
}
//# sourceMappingURL=index.js.map