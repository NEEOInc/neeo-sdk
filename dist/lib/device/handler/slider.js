"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sliderGet(handler, deviceId) {
    return Promise.resolve(handler(deviceId)).then(function (result) {
        return { value: result };
    });
}
exports.sliderGet = sliderGet;
function sliderSet(handler, value, deviceId) {
    return Promise.resolve(handler(deviceId, value)).then(function () {
        return { success: true };
    });
}
exports.sliderSet = sliderSet;
//# sourceMappingURL=slider.js.map