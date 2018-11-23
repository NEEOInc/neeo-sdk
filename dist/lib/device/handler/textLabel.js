"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getText(handler, deviceId) {
    return Promise.resolve(handler(deviceId)).then(function (result) {
        return { value: result };
    });
}
exports.getText = getText;
//# sourceMappingURL=textLabel.js.map