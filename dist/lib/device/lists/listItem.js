"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListItem = (function () {
    function ListItem(params) {
        if (params === void 0) { params = {}; }
        var title = params.title, label = params.label, isQueueable = params.isQueueable, thumbnailUri = params.thumbnailUri, browseIdentifier = params.browseIdentifier, actionIdentifier = params.actionIdentifier, uiAction = params.uiAction;
        this.title = title || '';
        this.label = label;
        this.isQueueable = isQueueable === true;
        this.thumbnailUri = thumbnailUri;
        this.browseIdentifier = browseIdentifier;
        this.actionIdentifier = actionIdentifier;
        if (uiAction) {
            this.uiAction = uiAction;
        }
    }
    return ListItem;
}());
exports.ListItem = ListItem;
//# sourceMappingURL=listItem.js.map