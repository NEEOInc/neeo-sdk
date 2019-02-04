"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../config");
var validate = require("./helper");
var url = require("fast-url-parser");
var LIST_MAX_LIMIT = config_1.default.maxListItemsPerPage;
var MAX_BUTTONS_PER_ROW = config_1.default.maxButtonsPerRow;
var MAX_TILES_PER_ROW = config_1.default.maxTilesPerRow;
var AVAILABLE_BUTTON_ICON_NAMES = ['shuffle', 'repeat'];
var VALID_UI_ACTIONS = ['reload', 'goToRoot', 'goBack', 'close'];
function validateItemParams(params) {
    if (!params) {
        throw new Error('ERROR_LIST_ITEM_PARAMS_EMPTY');
    }
    return params;
}
exports.validateItemParams = validateItemParams;
function validateRow(definitions, type) {
    var isNotArray = !Array.isArray(definitions);
    if (isNotArray) {
        throw new Error("ERROR_LIST_" + type.toUpperCase() + "_NO_ARRAY");
    }
    if (type === 'tiles' && definitions.length > MAX_TILES_PER_ROW) {
        throw new Error("ERROR_LIST_TILES_TOO_MANY_TILES, used: " + definitions.length + " / allowed: " + MAX_TILES_PER_ROW);
    }
    if (type === 'buttons' && definitions.length > MAX_BUTTONS_PER_ROW) {
        throw new Error("ERROR_LIST_BUTTONS_TOO_MANY_BUTTONS, used: " + definitions.length + " / allowed: " + MAX_BUTTONS_PER_ROW);
    }
}
exports.validateRow = validateRow;
function validateLimit(limit) {
    if (limit === undefined) {
        return LIST_MAX_LIMIT;
    }
    var isFiniteAndPositive = Number.isFinite(limit) && limit >= 0;
    if (!isFiniteAndPositive) {
        return LIST_MAX_LIMIT;
    }
    if (isFiniteAndPositive && limit && limit > LIST_MAX_LIMIT) {
        throw new Error("ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED, used: " + limit + " / max: " + LIST_MAX_LIMIT);
    }
    return limit;
}
exports.validateLimit = validateLimit;
function validateList(list) {
    validate.ensurePropertyValue(list, '_meta');
    validate.ensurePropertyValue(list._meta, 'current');
    ['current', 'previous', 'next'].forEach(function (key) {
        var meta = list._meta[key];
        if (!meta) {
            return;
        }
        var browseIdentifier = meta.browseIdentifier, offset = meta.offset, limit = meta.limit;
        if (browseIdentifier) {
            validate.isString(browseIdentifier);
        }
        validate.isInteger(offset);
        validate.isInteger(limit);
    });
    validate.isArray(list.items);
    list.items.forEach(function (item) {
        if (item.isHeader) {
            return validate.ensurePropertyValue(item, 'title');
        }
        if (item.title) {
            validate.isString(item.title);
        }
        if (item.label) {
            validate.isString(item.label);
        }
        if (item.thumbnailUri) {
            validateThumbnail(item.thumbnailUri);
        }
        if (item.tiles) {
            item.tiles.map(function (tile) {
                validateThumbnail(tile.thumbnailUri);
            });
        }
        if (item.buttons) {
            item.buttons.map(function (button) {
                validateButton(button);
            });
        }
        if (item.browseIdentifier) {
            validate.isString(item.browseIdentifier);
        }
        if (item.actionIdentifier) {
            validate.isString(item.actionIdentifier);
        }
        if (item.uiAction) {
            validate.isString(item.uiAction);
            validateUIAction(item.uiAction);
        }
    });
}
exports.validateList = validateList;
function validateThumbnail(thumbnail) {
    if (!thumbnail) {
        throw new Error('ERROR_LIST_THUMBNAIL_EMPTY');
    }
    var parsedThumbnailURI = url.parse(thumbnail);
    if (parsedThumbnailURI && !parsedThumbnailURI.host) {
        throw new Error('ERROR_LIST_THUMBNAIL_NO_URL');
    }
}
exports.validateThumbnail = validateThumbnail;
function validateButton(params) {
    if (!params || (!params.title && !params.iconName)) {
        throw new Error('ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY');
    }
    if (params.iconName) {
        validateButtonIcon(params.iconName);
    }
}
exports.validateButton = validateButton;
function validateButtonIcon(iconName) {
    if (typeof iconName !== 'string') {
        return;
    }
    if (AVAILABLE_BUTTON_ICON_NAMES.includes(iconName.toLowerCase())) {
        return iconName;
    }
    throw new Error("INVALID_ICON_NAME: " + iconName);
}
exports.validateButtonIcon = validateButtonIcon;
function validateUIAction(action) {
    if (!action) {
        return;
    }
    var isValidAction = VALID_UI_ACTIONS.includes(action);
    if (!isValidAction) {
        throw new Error("ERROR_LIST_ELEMENT_INVALID_UI_ACTION: " + action + ", allowed:\n      " + VALID_UI_ACTIONS.join(', '));
    }
    return action;
}
exports.validateUIAction = validateUIAction;
//# sourceMappingURL=list.js.map