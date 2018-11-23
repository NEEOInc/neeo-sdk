"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getImageUri(handler, deviceId) {
    return Promise.resolve(handler(deviceId)).then(function (result) {
        return { value: result };
    });
}
exports.getImageUri = getImageUri;
//# sourceMappingURL=imageUrl.js.map