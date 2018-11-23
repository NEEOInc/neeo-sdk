"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var NIC_LIST = os.networkInterfaces();
function getAnyIpAddress() {
    for (var _i = 0, _a = Object.keys(NIC_LIST); _i < _a.length; _i++) {
        var key = _a[_i];
        for (var _b = 0, _c = NIC_LIST[key]; _b < _c.length; _b++) {
            var _d = _c[_b], family = _d.family, internal = _d.internal, address = _d.address;
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
    return '127.0.0.1';
}
exports.getAnyIpAddress = getAnyIpAddress;
//# sourceMappingURL=ipHelper.js.map