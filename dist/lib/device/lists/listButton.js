"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListButton = (function () {
    function ListButton(params) {
        this.isButton = true;
        var iconName;
        (iconName = params.iconName, this.title = params.title, this.inverse = params.inverse, this.actionIdentifier = params.actionIdentifier);
        this.iconName = iconName;
    }
    return ListButton;
}());
exports.ListButton = ListButton;
//# sourceMappingURL=listButton.js.map