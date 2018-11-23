"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListTile = (function () {
    function ListTile(params) {
        this.isTile = true;
        if (!params) {
            throw new Error('LIST_TILE_MISSING_PARAMS');
        }
        var thumbnailUri = params.thumbnailUri, isQueueable = params.isQueueable, actionIdentifier = params.actionIdentifier, uiAction = params.uiAction;
        this.thumbnailUri = thumbnailUri;
        this.isQueueable = isQueueable === true;
        this.actionIdentifier = actionIdentifier;
        if (uiAction) {
            this.uiAction = uiAction;
        }
    }
    return ListTile;
}());
exports.ListTile = ListTile;
//# sourceMappingURL=listTile.js.map