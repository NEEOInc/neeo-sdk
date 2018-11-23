"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var debug = Debug('neeo:device:express:route:handler:directory');
function directoryGet(handler, deviceId, params) {
    return Promise.resolve(handler(deviceId, params)).then(function (browseResult) {
        if (!browseResult) {
            var error = new Error('DIRECTORY_NO_BROWSERESULT_RETURNED_FROM_GETTER');
            debug(error);
            throw error;
        }
        return browseResult;
    });
}
exports.directoryGet = directoryGet;
function callAction(handler, deviceId, params) {
    return Promise.resolve(handler(deviceId, params));
}
exports.callAction = callAction;
//# sourceMappingURL=directory.js.map