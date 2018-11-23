"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluePromise = require("bluebird");
function trigger(deviceId, handler) {
    return BluePromise.resolve(handler(deviceId)).then(function () {
        return { success: true };
    });
}
exports.trigger = trigger;
//# sourceMappingURL=button.js.map