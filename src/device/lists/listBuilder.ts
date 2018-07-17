import * as Debug from 'debug';
import * as Models from '../../models';
import { ListItem } from './listItem';
import { ListHeader } from './listHeader';
import { ListTileRow } from './listTileRow';
import { ListInfoItem } from './listInfoItem';
import { ListButtonRow } from './listButtonRow';
import * as listValidation from '../validation/list';
import config from '../../config';

const debug = Debug('neeo:device:list:builder');

const DEFAULT_OFFSET = 0;

export default class implements Models.ListBuilder {
  private limit: number;
  private offset: number;
  private totalMatchingItems: number;
  private browseIdentifier?: string;

  readonly items: Models.ListBuilder.Item[] = [];
  _meta: Models.ListBuilder.Metadata = {};
  title: string;

  constructor({
    title,
    limit,
    offset,
    totalMatchingItems,
    browseIdentifier
  }: Models.ListBuilder.Parameters = {}) {
    this.title = listValidation.validateTitle(title);
    this.limit = listValidation.validateLimit(limit);
    this.offset =
      Number.isFinite(offset) && offset >= 0 ? offset : DEFAULT_OFFSET;
    this.totalMatchingItems = Number.isFinite(totalMatchingItems)
      ? totalMatchingItems
      : 0;
    this.browseIdentifier = browseIdentifier;
    this.build();
  }

  setListTitle(name: string) {
    this.title = listValidation.validateTitle(name);
    this.build();
    return this;
  }

  setTotalMatchingItems(totalMatchingItems: number) {
    this.totalMatchingItems = Number.isFinite(totalMatchingItems)
      ? totalMatchingItems
      : 0;
    this.build();
    return this;
  }

  addListItem(params: Models.ListItemParameters, updateList = true) {
    listValidation.validateItemParams(params);
    const listItem = new ListItem(params);
    this.items.push(listItem);
    if (updateList) {
      this.build();
    }
    return this;
  }

  addListItems(rawItems: ReadonlyArray<Models.ListItemParameters>) {
    const itemsToAdd = this.prepareItemsAccordingToOffsetAndLimit(rawItems);
    itemsToAdd.forEach(listItem => this.addListItem(listItem, false));
    this.build();
    return this;
  }

  addListHeader(title: string) {
    const header = new ListHeader(title);
    this.items.push(header);
    this.build();
    return this;
  }

  addListTiles(params: ReadonlyArray<Models.ListTileParameters>) {
    const tileRow = new ListTileRow(params);
    this.items.push(tileRow.getTiles());
    this.build();
    return this;
  }

  addListInfoItem(params: Models.ListInfoItemParameters) {
    const tile = new ListInfoItem(params);
    this.items.push(tile);
    this.build();
    return this;
  }

  addListButtons(params: ReadonlyArray<Models.ListButtonParameters>) {
    const row = new ListButtonRow(params);
    this.items.push(row.getButtons());
    this.build();
    return this;
  }

  /**
   * This function applies the list limit and offset to a given list.
   * @param array Prepared files that might be wrong according to offset and limit
   * @return Items that can be added to the list according to the given offset and limit
   * @example
   *    .prepareItemsAccordingToOffsetAndLimit([
   *      { name: 'foo' },
   *      { name: 'bar' }
   *    ])
   */
  private prepareItemsAccordingToOffsetAndLimit<T>(
    array: ReadonlyArray<T>
  ): ReadonlyArray<T> {
    const { offset, limit, items } = this;
    const offsetNextIndex = offset ? offset - 1 : 0;
    const effectiveLimit = limit ? limit : config.maxListItemsPerPage;
    const currentEntriesCount = items.length;
    const entriesToAdd = effectiveLimit - currentEntriesCount;
    if (entriesToAdd < 1) {
      debug('WARNING_LIST_FULL %o', {
        offsetNextIndex,
        effectiveLimit,
        currentEntriesCount
      });
      return [];
    }
    return array.slice(offsetNextIndex, offsetNextIndex + entriesToAdd);
  }

  private build() {
    this.buildMetadata();
    this.verifyFullList();
  }

  private buildMetadata() {
    const { items, totalMatchingItems, offset, limit, browseIdentifier } = this;
    const meta: Models.ListBuilder.Metadata = (this._meta = {
      totalItems: items.length,
      totalMatchingItems: Number.isFinite(totalMatchingItems)
        ? totalMatchingItems
        : items.length,
      current: { offset, limit, browseIdentifier }
    });
    const nonSpecial = items.filter(item => {
      return (
        !item.isTile &&
        !item.isHeader &&
        !item.isInfoItem &&
        !item.isButton &&
        !item.isIconButton
      );
    });
    const nextOffset = offset + nonSpecial.length;
    if (Number.isFinite(offset) && meta.totalMatchingItems! > nextOffset) {
      meta.next = {
        offset: nextOffset,
        limit,
        browseIdentifier
      };
    }
    if (offset > 0) {
      meta.previous = {
        offset: Math.max(offset - limit, 0),
        limit: Math.min(limit, offset),
        browseIdentifier
      };
    }
  }

  private verifyFullList() {
    return listValidation.validateList(this);
  }
}
