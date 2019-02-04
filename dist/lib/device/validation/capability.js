"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAPABILITIES = [
    'addAnotherDevice',
    'alwaysOn',
    'bridgeDevice',
    'dynamicDevice',
    'groupVolume',
];
function getCapability(capability) {
    if (CAPABILITIES.includes(capability)) {
        return capability;
    }
    throw new Error('INVALID_CAPABILITY: ' + capability);
}
exports.getCapability = getCapability;
//# sourceMappingURL=capability.js.map