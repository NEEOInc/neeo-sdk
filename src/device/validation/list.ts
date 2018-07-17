import config from '../../config';
import validate from './helper';
import * as Models from '../../models';

const url = require('fast-url-parser') as typeof import('url');

const LIST_MAX_LIMIT = config.maxListItemsPerPage;
const MAX_BUTTONS_PER_ROW = config.maxButtonsPerRow;
const MAX_TILES_PER_ROW = config.maxTilesPerRow;
const AVAILABLE_BUTTON_ICON_NAMES = ['shuffle', 'repeat'];

export function validateTitle(title?: string) {
  if (!title) {
    throw new Error('ERROR_LIST_TITLE_EMPTY');
  }
  return title;
}

export function validateRow<T>(
  definitions: ReadonlyArray<T>,
  type: 'tiles' | 'buttons'
) {
  const isNotArray = !Array.isArray(definitions);
  if (isNotArray) {
    throw new Error(`ERROR_LIST_${type.toUpperCase()}_NO_ARRAY`);
  }

  if (type === 'tiles' && definitions.length > MAX_TILES_PER_ROW) {
    throw new Error(
      `ERROR_LIST_TILES_TOO_MANY_TILES, used: ${
        definitions.length
      } / allowed: ${MAX_TILES_PER_ROW}`
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

export function validateThumbnail(thumbnail: string) {
  if (!thumbnail) {
    throw new Error('ERROR_LIST_THUMBNAIL_EMPTY');
  }
  const parsedThumbnailURI = url.parse(thumbnail);
  if (parsedThumbnailURI && !parsedThumbnailURI.host) {
    throw new Error('ERROR_LIST_THUMBNAIL_NO_URL');
  }
  return thumbnail;
}

export function validateItemParams(params: any) {
  if (!params) {
    throw new Error('ERROR_LIST_ITEM_PARAMS_EMPTY');
  }
  return params;
}

export function validateButton(params: { title?: string }) {
  if (!params || !params.title) {
    throw new Error('ERROR_LIST_BUTTON_TITLE_EMPTY');
  }
}

export function validateLimit(limit?: number) {
  const isFiniteAndPositive = Number.isFinite(limit) && limit >= 0;
  if (!isFiniteAndPositive) {
    return LIST_MAX_LIMIT;
  }
  if (limit! > LIST_MAX_LIMIT) {
    throw new Error(
      `ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED, used: ${limit} / max: ${LIST_MAX_LIMIT}`
    );
  }
  return limit!;
}

export function validateList(list: Models.ListBuilder) {
  validate(list, {
    _meta: { presence: true }
  });

  validate(list._meta, {
    current: { presence: true }
  });

  ['current', 'previous', 'next'].forEach(key => {
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

  list.items.forEach(item => {
    if (item.isHeader) {
      return validate(item, {
        title: { presence: true }
      });
    }

    if (item.title) {
      validate.isString(item.title);
    }

    if (item.label) {
      validate.isString(item.label);
    }

    if (item.thumbnailUri) {
      validate.isString(item.thumbnailUri);
    }

    if (item.browseIdentifier) {
      validate.isString(item.browseIdentifier);
    }

    if (item.actionIdentifier) {
      validate.isString(item.actionIdentifier);
    }
  });
}

export function validateButtonIcon(iconName: string) {
  if (typeof iconName !== 'string') {
    return;
  }
  if (AVAILABLE_BUTTON_ICON_NAMES.includes(iconName.toLowerCase())) {
    return iconName;
  }
  throw new Error(`INVALID_ICON_NAME: ${iconName}`);
}
