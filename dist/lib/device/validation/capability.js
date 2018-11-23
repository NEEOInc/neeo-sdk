"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAPABILITIES = [
    'alwaysOn',
    'bridgeDevice',
    'dynamicDevice',
    'addAnotherDevice',
    'groupVolume',
];
function getCapability(capability) {
    if (CAPABILITIES.includes(capability)) {
        return capability;
    }
    throw new Error('INVALID_CAPABILITY');
}
exports.getCapability = getCapability;
//# sourceMappingURL=capability.js.map