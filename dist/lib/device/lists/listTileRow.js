"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var listValidation = require("../validation/list");
var listTile_1 = require("./listTile");
var ListTileRow = (function () {
    function ListTileRow(tileDefinitions) {
        this.tileDefinitions = tileDefinitions;
        listValidation.validateRow(tileDefinitions, 'tiles');
    }
    ListTileRow.prototype.getTiles = function () {
        return {
            tiles: this.tileDefinitions.map(function (params) { return new listTile_1.ListTile(params); }),
        };
    };
    return ListTileRow;
}());
exports.ListTileRow = ListTileRow;
//# sourceMappingURL=listTileRow.js.map