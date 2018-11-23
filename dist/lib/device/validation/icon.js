"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AVAILABLE_ICON_NAMES = ['sonos', 'neeo-brain'];
function getIcon(name) {
    if (name) {
        name = name.toLowerCase();
    }
    if (!AVAILABLE_ICON_NAMES.includes(name)) {
        throw new Error("INVALID_ICON_NAME: " + name);
    }
    return name;
}
exports.getIcon = getIcon;
//# sourceMappingURL=icon.js.map