"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var device_1 = require("./device");
var expressBrainDriver_1 = require("./expressBrainDriver");
var nodeCheck_1 = require("./nodeCheck");
nodeCheck_1.checkNodeVersion();
tslib_1.__exportStar(require("./discover"), exports);
tslib_1.__exportStar(require("./recipe"), exports);
tslib_1.__exportStar(require("./models"), exports);
var device_2 = require("./device");
exports.buildBrowseList = device_2.buildBrowseList;
exports.buildDevice = device_2.buildDevice;
exports.buildDeviceState = device_2.buildDeviceState;
exports.stopServer = device_2.stopServer;
function startServer(configuration) {
    return device_1.startServer(configuration, expressBrainDriver_1.default);
}
exports.startServer = startServer;
//# sourceMappingURL=index.js.map