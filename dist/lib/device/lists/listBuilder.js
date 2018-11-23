"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var config_1 = require("../../config");
var listValidation = require("../validation/list");
var listButtonRow_1 = require("./listButtonRow");
var listHeader_1 = require("./listHeader");
var listInfoItem_1 = require("./listInfoItem");
var listItem_1 = require("./listItem");
var listTileRow_1 = require("./listTileRow");
var debug = Debug('neeo:device:list:builder');
var DEFAULT_OFFSET = 0;
var default_1 = (function () {
    function default_1(_a) {
        var _b = _a === void 0 ? {} : _a, title = _b.title, limit = _b.limit, offset = _b.offset, totalMatchingItems = _b.totalMatchingItems, browseIdentifier = _b.browseIdentifier;
        this.items = [];
        this._meta = {};
        this.title = title || '';
        this.limit = listValidation.validateLimit(limit);
        this.offset = offset && Number.isFinite(offset) && offset >= 0 ? offset : DEFAULT_OFFSET;
        this.totalMatchingItems =
            totalMatchingItems && Number.isFinite(totalMatchingItems) ? totalMatchingItems : 0;
        this.browseIdentifier = browseIdentifier;
        this.build();
        return this;
    }
    default_1.prototype.setListTitle = function (name) {
        this.title = name || '';
        this.build();
        return this;
    };
    default_1.prototype.setTotalMatchingItems = function (totalMatchingItems) {
        this.totalMatchingItems = Number.isFinite(totalMatchingItems) ? totalMatchingItems : 0;
        this.build();
        return this;
    };
    default_1.prototype.addListItem = function (params, updateList) {
        if (updateList === void 0) { updateList = true; }
        listValidation.validateItemParams(params);
        var listItem = new listItem_1.ListItem(params);
        this.items.push(listItem);
        if (updateList) {
            this.build();
        }
        return this;
    };
    default_1.prototype.addListItems = function (rawItems) {
        var _this = this;
        var itemsToAdd = this.prepareItemsAccordingToOffsetAndLimit(rawItems);
        itemsToAdd.forEach(function (listItem) { return _this.addListItem(listItem, false); });
        this.build();
        return this;
    };
    default_1.prototype.addListHeader = function (title) {
        var header = new listHeader_1.ListHeader(title);
        this.items.push(header);
        this.build();
        return this;
    };
    default_1.prototype.addListTiles = function (params) {
        var tileRow = new listTileRow_1.ListTileRow(params);
        this.items.push(tileRow.getTiles());
        this.build();
        return this;
    };
    default_1.prototype.addListInfoItem = function (params) {
        var tile = new listInfoItem_1.ListInfoItem(params);
        this.items.push(tile);
        this.build();
        return this;
    };
    default_1.prototype.addListButtons = function (params) {
        var row = new listButtonRow_1.ListButtonRow(params);
        this.items.push(row.getButtons());
        this.build();
        return this;
    };
    default_1.prototype.prepareItemsAccordingToOffsetAndLimit = function (array) {
        var _a = this, offset = _a.offset, limit = _a.limit, items = _a.items;
        var offsetNextIndex = offset ? offset - 1 : 0;
        var effectiveLimit = limit || config_1.default.maxListItemsPerPage;
        var currentEntriesCount = items.length;
        var entriesToAdd = effectiveLimit - currentEntriesCount;
        if (entriesToAdd < 1) {
            debug('WARNING_LIST_FULL %o', {
                offsetNextIndex: offsetNextIndex,
                effectiveLimit: effectiveLimit,
                currentEntriesCount: currentEntriesCount,
            });
            return [];
        }
        return array.slice(offsetNextIndex, offsetNextIndex + entriesToAdd);
    };
    default_1.prototype.build = function () {
        this.buildMetadata();
        this.verifyFullList();
    };
    default_1.prototype.buildMetadata = function () {
        var _a = this, items = _a.items, totalMatchingItems = _a.totalMatchingItems, offset = _a.offset, limit = _a.limit, browseIdentifier = _a.browseIdentifier;
        var meta = (this._meta = {
            totalItems: items.length,
            totalMatchingItems: Number.isFinite(totalMatchingItems) ? totalMatchingItems : items.length,
            current: { offset: offset, limit: limit, browseIdentifier: browseIdentifier },
        });
        var nonSpecial = items.filter(function (item) {
            return (!item.isTile && !item.isHeader && !item.isInfoItem && !item.isButton && !item.isIconButton);
        });
        var nextOffset = offset + nonSpecial.length;
        if (Number.isFinite(offset) && meta.totalMatchingItems > nextOffset) {
            meta.next = {
                offset: nextOffset,
                limit: limit,
                browseIdentifier: browseIdentifier,
            };
        }
        if (offset > 0) {
            meta.previous = {
                offset: Math.max(offset - limit, 0),
                limit: Math.min(limit, offset),
                browseIdentifier: browseIdentifier,
            };
        }
    };
    default_1.prototype.verifyFullList = function () {
        return listValidation.validateList(this);
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=listBuilder.js.map