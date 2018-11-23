"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function switchGet(handler, deviceId) {
    return Promise.resolve(handler(deviceId)).then(function (result) {
        return { value: result };
    });
}
exports.switchGet = switchGet;
function switchSet(handler, value, deviceId) {
    return Promise.resolve(handler(deviceId, value)).then(function () {
        return { success: true };
    });
}
exports.switchSet = switchSet;
//# sourceMappingURL=switch.js.map