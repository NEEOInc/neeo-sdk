"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var listValidation = require("../validation/list");
var listButton_1 = require("./listButton");
var ListButtonRow = (function () {
    function ListButtonRow(buttonDefinitions) {
        this.buttonDefinitions = buttonDefinitions;
        listValidation.validateRow(buttonDefinitions, 'buttons');
    }
    ListButtonRow.prototype.getButtons = function () {
        return {
            buttons: this.buttonDefinitions.map(function (params) { return new listButton_1.ListButton(params); }),
        };
    };
    return ListButtonRow;
}());
exports.ListButtonRow = ListButtonRow;
//# sourceMappingURL=listButtonRow.js.map