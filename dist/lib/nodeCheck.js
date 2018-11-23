"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var semver_1 = require("semver");
var debug = Debug('neeo:nodecheck');
var NODE_VERSION_REQUIREMENT = '>=6.0';
function checkNodeVersion(nodeVersion) {
    if (nodeVersion === void 0) { nodeVersion = process.versions.node; }
    var invalid = !semver_1.satisfies(semver_1.coerce(nodeVersion), NODE_VERSION_REQUIREMENT);
    debug('check if current node runtime is invalid:', invalid);
    if (!invalid) {
        return;
    }
    debug('node runtime version is invalid');
    throw new Error('You must run the NEEO SDK on node >= 6.0. Your current node version is ' + nodeVersion + '.');
}
exports.checkNodeVersion = checkNodeVersion;
//# sourceMappingURL=nodeCheck.js.map