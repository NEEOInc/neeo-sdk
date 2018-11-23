"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var os = require("os");
function default_1(text, uniqueString) {
    return crypto
        .createHash('sha1')
        .update("" + (uniqueString || os.hostname()) + text, 'utf8')
        .digest('hex');
}
exports.default = default_1;
//# sourceMappingURL=uniqueName.js.map