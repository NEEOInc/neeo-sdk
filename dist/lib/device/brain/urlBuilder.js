"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_BRAIN_PORT = 3000;
var PROTOCOL = 'http://';
function default_1(brain, baseUrl, brainPort) {
    if (baseUrl === void 0) { baseUrl = ''; }
    if (!brain) {
        throw new Error('URLBUILDER_MISSING_PARAMETER_BRAIN');
    }
    if (typeof brain === 'string') {
        return "" + PROTOCOL + brain + ":" + (brainPort || DEFAULT_BRAIN_PORT) + baseUrl;
    }
    var host = brain.host, port = brain.port;
    if (!host || !port) {
        throw new Error('URLBUILDER_INVALID_PARAMETER_BRAIN');
    }
    return "" + PROTOCOL + host + ":" + port + baseUrl;
}
exports.default = default_1;
//# sourceMappingURL=urlBuilder.js.map