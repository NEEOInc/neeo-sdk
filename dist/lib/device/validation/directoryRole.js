"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VALID_DIRECTORY_ROLES = ['ROOT', 'QUEUE'];
function validate(role) {
    if (!VALID_DIRECTORY_ROLES.includes(role)) {
        throw new Error("INVALID_DIRECTORY_ROLE: " + role);
    }
}
exports.validate = validate;
//# sourceMappingURL=directoryRole.js.map