"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VALID_SECURITY_TYPES = ['SECURITY_CODE', 'ACCOUNT'];
function validate(type) {
    if (!VALID_SECURITY_TYPES.includes(type)) {
        throw new Error("INVALID_REGISTRATION_TYPE: " + type);
    }
}
exports.validate = validate;
//# sourceMappingURL=registrationType.js.map