"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var listItem_1 = require("./listItem");
var ListInfoItem = (function (_super) {
    tslib_1.__extends(ListInfoItem, _super);
    function ListInfoItem(params) {
        var _this = _super.call(this, params) || this;
        _this.isInfoItem = true;
        (_this.text = params.text, _this.affirmativeButtonText = params.affirmativeButtonText, _this.negativeButtonText = params.negativeButtonText);
        return _this;
    }
    return ListInfoItem;
}(listItem_1.ListItem));
exports.ListInfoItem = ListInfoItem;
//# sourceMappingURL=listInfoItem.js.map