"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasNoInputButtonsDefined(buttons) {
    if (!Array.isArray(buttons)) {
        throw new Error('NOT_ARRAY_PARAMETER');
    }
    return buttons.every(function (_a) {
        var param = _a.param;
        return !param || !param.name || !/INPUT.*/.test(param.name);
    });
}
exports.hasNoInputButtonsDefined = hasNoInputButtonsDefined;
//# sourceMappingURL=inputMacroChecker.js.map