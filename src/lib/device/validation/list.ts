import config from '../../config';
import * as Models from '../../models';
import * as validate from './helper';

import * as url from 'fast-url-parser';

const LIST_MAX_LIMIT = config.maxListItemsPerPage;
const MAX_BUTTONS_PER_ROW = config.maxButtonsPerRow;
const MAX_TILES_PER_ROW = config.maxTilesPerRow;
const AVAILABLE_BUTTON_ICON_NAMES = ['shuffle', 'repeat'];
const VALID_UI_ACTIONS = ['reload', 'goToRoot', 'goBack', 'close'];

export function validateItemParams(params: any) {
  if (!params) {
    throw new Error('ERROR_LIST_ITEM_PARAMS_EMPTY');
  }
  return params;
}

export function validateRow<T>(definitions: ReadonlyArray<T>, type: 'tiles' | 'buttons') {
  const isNotArray = !Array.isArray(definitions);
  if (isNotArray) {
    throw new Error(`ERROR_LIST_${type.toUpperCase()}_NO_ARRAY`);
  }

  if (type === 'tiles' && definitions.length > MAX_TILES_PER_ROW) {
    throw new Error(
      `ERROR_LIST_TILES_TOO_MANY_TILES, used: ${definitions.length} / allowed: ${MAX_TILES_PER_ROW}`
    );
  }

  if (type === 'buttons' && definitions.length > MAX_BUTTONS_PER_ROW) {
    throw new Error(
      `ERROR_LIST_BUTTONS_TOO_MANY_BUTTONS, used: ${
        definitions.length
      } / allowed: ${MAX_BUTTONS_PER_ROW}`
    );
  }
}

export function validateLimit(limit?: number) {
  if (limit === undefined) {
    return LIST_MAX_LIMIT;
  }

  const isFiniteAndPositive = Number.isFinite(limit) && limit >= 0;

  if (!isFiniteAndPositive) {
    return LIST_MAX_LIMIT;
  }

  if (isFiniteAndPositive && limit && limit > LIST_MAX_LIMIT) {
    throw new Error(`ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED, used: ${limit} / max: ${LIST_MAX_LIMIT}`);
  }

  return limit;
}

export function validateList(list: Models.ListBuilder) {
  validate.ensurePropertyValue(list, '_meta');
  validate.ensurePropertyValue(list._meta, 'current');

  ['current', 'previous', 'next'].forEach((key) => {
    const meta = list._meta[key as 'current' | 'previous' | 'next'];
    if (!meta) {
      return;
    }
    const { browseIdentifier, offset, limit } = meta;
    if (browseIdentifier) {
      validate.isString(browseIdentifier);
    }
    validate.isInteger(offset);
    validate.isInteger(limit);
  });

  validate.isArray(list.items);

  list.items.forEach((item) => {
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
      item.tiles.map((tile) => {
        validateThumbnail(tile.thumbnailUri);
      });
    }

    if (item.buttons) {
      item.buttons.map((button) => {
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

export function validateThumbnail(thumbnail?: string) {
  if (!thumbnail) {
    throw new Error('ERROR_LIST_THUMBNAIL_EMPTY');
  }
  const parsedThumbnailURI = url.parse(thumbnail);
  if (parsedThumbnailURI && !parsedThumbnailURI.host) {
    throw new Error('ERROR_LIST_THUMBNAIL_NO_URL');
  }
}

export function validateButton(params: { title?: string; iconName?: 'shuffle' | 'repeat' | undefined }) {
  if (!params || (!params.title && !params.iconName)) {
    throw new Error('ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY');
  }

  if (params.iconName) {
    validateButtonIcon(params.iconName);
  }
}

export function validateButtonIcon(iconName: 'shuffle' | 'repeat' | undefined) {
  if (typeof iconName !== 'string') {
    return;
  }
  if (AVAILABLE_BUTTON_ICON_NAMES.includes(iconName.toLowerCase())) {
    return iconName;
  }
  throw new Error(`INVALID_ICON_NAME: ${iconName}`);
}

export function validateUIAction(action?: string) {
  if (!action) {
    return;
  }

  const isValidAction = VALID_UI_ACTIONS.includes(action);
  if (!isValidAction) {
    throw new Error(`ERROR_LIST_ELEMENT_INVALID_UI_ACTION: ${action}, allowed:
      ${VALID_UI_ACTIONS.join(', ')}`);
  }

  return action;
}
