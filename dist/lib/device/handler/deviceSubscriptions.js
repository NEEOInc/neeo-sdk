"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var debug = Debug('neeo:device:express:roout:handler:devicesubscription');
var SUCCESS = function () { return ({ success: true }); };
function deviceAdded(handler, deviceId) {
    debug('device added:', deviceId);
    return Promise.resolve(handler(deviceId)).then(SUCCESS);
}
exports.deviceAdded = deviceAdded;
function deviceRemoved(handler, deviceId) {
    debug('device removed:', deviceId);
    return Promise.resolve(handler(deviceId)).then(SUCCESS);
}
exports.deviceRemoved = deviceRemoved;
//# sourceMappingURL=deviceSubscriptions.js.map