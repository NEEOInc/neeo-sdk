"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluePromise = require("bluebird");
var Debug = require("debug");
var debug = Debug('neeo:device:express:route:handler:registration');
function isRegistered(isRegisteredHandler) {
    return BluePromise.resolve(isRegisteredHandler()).then(function (registered) {
        debug('isRegistered', registered);
        return { registered: registered };
    });
}
exports.isRegistered = isRegistered;
function register(registrationHandler, userData) {
    return BluePromise.resolve(registrationHandler(userData)).then(function (result) {
        debug('Register result', result);
        return result;
    });
}
exports.register = register;
//# sourceMappingURL=registration.js.map