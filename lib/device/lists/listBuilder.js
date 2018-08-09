'use strict';

const debug = require('debug')('neeo:device:list:builder');
const config = require('../../config');
const listValidation = require('../validation/list');
const ListItem = require('./listItem');
const ListHeader = require('./listHeader');
const ListTileRow = require('./listTileRow');
const ListInfoItem = require('./listInfoItem');
const ListButtonRow = require('./listButtonRow');

const DEFAULT_OFFSET = 0;

/**
 * @module ListBuilder
 * @description Factory method to build a custom list.
 * @param {Object} options An object which contains at least following attributes:
 * @param {String} options.title optional title of the list (see also setListTitle). The list title is only displayed when you add the directory as shortcut
 * @param {Number} options.totalMatchingItems optional if the list contains less than options.limit entries. If there are more than options.limit entries in the list, this value should be set to the total numbers of the list. Note: totalMatchingItems can be updated at a later time using the function setTotalMatchingItems
 * @param {Number} options.limit optional, how many items should be queried per page (used for pagination). The default and maximum is 64
 * @param {Number} options.offset optional, default starting offset (used for pagination)
 * @param {String} options.browseIdentifier optional, identifier that is passed with a browse request to identify which "path" should be browsed
 * @return {ListBuilder} factory methods to build list
 * @example
 *  neeoapi.buildBrowseList({
 *      title: 'list title',
 *      totalMatchingItems: 100,
 *      limit: 20,
 *      offset: 0,
 *      browseIdentifier: 'browseEverything'
 *    })
 *    .addListHeader('NEEO Header')
 *    .addListItem({
 *      title: 'foo'
 *    })
 *
 */
/** */ // avoid doxdox thinking the @module above is for this function.

module.exports = class ListBuilder {
  constructor(options = {}) {
    this.title = listValidation.validateTitle(options.title || '');
    this.limit = listValidation.validateLimit(options.limit);
    const offsetIsValid = Number.isFinite(options.offset) && options.offset >= 0;
    this.offset = offsetIsValid ? options.offset : DEFAULT_OFFSET;
    this.totalMatchingItems = Number.isFinite(options.totalMatchingItems) ? options.totalMatchingItems : 0;
    this.browseIdentifier = options.browseIdentifier;
    this.items = [];
    this._build();
    return this;
  }

  /**
   * @function setListTitle
   * @description This function sets the name of the list. The list title is only displayed when you add the directory as shortcut.
   * @param {String} name the list name
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .setListTitle('it is a name!')
   */
  setListTitle(name) {
    this.title = listValidation.validateTitle(name);
    this._build();
    return this;
  }

  /**
   * @function setTotalMatchingItems
   * @description This function updates the totalMatchingItems number of the list (used for pagination).
   * @param {Integer} totalMatchingItems the total length of the list
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .setTotalMatchingItems(100)
   */
  setTotalMatchingItems(totalMatchingItems) {
    this.totalMatchingItems = Number.isFinite(totalMatchingItems) ? totalMatchingItems : 0;
    this._build();
    return this;
  }

  /**
   * @function addListItem
   * @description This function adds an item to the list.
   * To avoid downloading and resizing large images on the Brain you should provide an image of 80x80px.
   * These guidelines are specifically for the remote, a larger (maybe double) resolution might offer a good compromise for mobile devices.
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.title title that will be shown on the list item entry
   * @param {String} configuration.label optional, additional label
   * @param {String} configuration.thumbnailUri optional, URL that points to an image that will be displayed on the list item
   * @param {String} configuration.browseIdentifier optional, identifier that is passed with a browse request to identify which "path" should be browsed
   * @param {String} configuration.actionIdentifier optional, string passed back to handling function when item is clicked
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListItem({
   *      title: 'First List Item',
   *      thumbnailUri: 'https://www.image.com/image.jpg'
   *    })
   */
  addListItem(params, updateList = true) {
    listValidation.validateItemParams(params);
    const listItem = new ListItem(params);
    this.items.push(listItem);
    if (updateList) {
      this._build();
    }
    return this;
  }

  /*
   * @function addListItems
   * @description add an array of ListItem to a list. this function limits the amount of items to add depending on the options.limit setting (it never adds more than options.limit entires).
   * @param {Array} Array of ListItem JSON elements
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListItems([
   *      { title: 'foo' },
   *      { title: 'bar' }
   *    ])
   */
  addListItems(rawItems) {
    const itemsToAdd = this.prepareItemsAccordingToOffsetAndLimit(rawItems);
    itemsToAdd.forEach((listItem) => {
      this.addListItem(listItem, false);
    });
    this._build();
    return this;
  }

  /**
   * @function addListHeader
   * @description This function adds a header to the list, which can be used as a visual separator. A ListHeader is a pure visual informational object.
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.title title that will be shown on the list item entry
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListHeader({
   *      title: 'My Header',
   *    })
   */
  addListHeader(title) {
    const header = new ListHeader(title);
    this.items.push(header);
    this._build();
    return this;
  }

  /**
   * @function addListTiles
   * @description This function adds a row of tiles to the list. It takes an array of up to two tiles. A ListTile shows a large thumbnail and the defined action will be executed when the ListTile element is selected.
   * To avoid downloading and resizing large images on the Brain you should provide an image of 215x215px.
   * These guidelines are specifically for the remote, a larger (maybe double) resolution might offer a good compromise for mobile devices.
   * @param {Array} configuration Configuration Array
   * @param {String} configuration.thumbnailUri optional, URL that points to an image that will be displayed on the list item
   * @param {String} configuration.actionIdentifier optional, string passed back to handling function when item is clicked
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListTile([{
   *      thumbnailUri: 'https://www.image.com/image.jpg',
   *    }])
   */
  addListTiles(params) {
    const tileRow = new ListTileRow(params);
    const tiles = tileRow.getTiles();
    this.items.push(tiles);
    this._build();
    return this;
  }

  /**
   * @function addListInfoItem
   * @description This function adds an info item to the list. Pressing this element will open a popup with the defined text.
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.title title that will be shown on the list item entry
   * @param {String} configuration.text text that will be shown in the resulting popup. This is the only text that will be shown on the NEEO remote.
   * @param {String} configuration.affirmativeButtonText optional, will be shown on the OK popup button
   * @param {String} configuration.negativeButtonText optional, will be shown on the CANCEL popup button
   * @param {String} configuration.actionIdentifier optional, passed back to handling function when item is clicked
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListInfoItem({
   *      title: 'This is only an information and I will open a popup',
   *      text: 'I am the popup text',
   *      affirmativeButtonText: 'OK',
   *      negativeButtonText: 'Cancel',
   *      actionIdentifier: 'OK_CLICKED',
   *    })
   */
  addListInfoItem(params) {
    const tile = new ListInfoItem(params);
    this.items.push(tile);
    this._build();
    return this;
  }

  /**
   * @function addListButtons
   * @description This function adds a row of buttons to the list. It takes an array of up to three buttons. The defined action will be executed when the button is pressed.
   * @param {Array} configuration Configuration Array
   * @param {String} configuration.iconName icon that will be shown on the list item entry instead of the text - available icons: 'Shuffle', 'Repeat'. Note: either iconName or title must be defined
   * @param {String} configuration.title title that will be shown on the list item entry. Note: either iconName or title must be defined
   * @param {String} configuration.actionIdentifier optional, string passed back to handling function when button is clicked
   * @param {Boolean} configuration.inverse optional, removes the background color of the button
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListButtons([{
   *      iconName: 'Shuffle',
   *      actionIdentifier: 'ROW1_SHUFFLE',
   *    }])
   *    .addListButtons([{
   *      iconName: 'Repeat',
   *      actionIdentifier: 'ROW2_REPEAT',
   *    }, {
   *      title: 'Play All',
   *      inverse: true,
   *      actionIdentifier: 'ROW2_PLAYALL',
   *    }])
   */
  addListButtons(definitions) {
    const listButtonRow = new ListButtonRow(definitions);
    const buttons = listButtonRow.getButtons();
    this.items.push(buttons);
    this._build();
    return this;
  }

  /*
   * @function prepareItemsAccordingToOffsetAndLimit
   * @description This function applies the list limit and offset to a given list.
   * @param {Array} files Prepared files that might be wrong according to offset and limit
   * @return {Array} Items that can be added to the list according to the given offset and limit
   * @example
   *    .prepareItemsAccordingToOffsetAndLimit([
   *      { name: 'foo' },
   *      { name: 'bar' }
   *    ])
   */
  prepareItemsAccordingToOffsetAndLimit(items) {
    const offsetNextIndex = this.offset ? this.offset - 1 : 0;
    const limit = this.limit ? this.limit : config.maxListItemsPerPage;
    const currentEntriesCount = this.items.length;
    const entriesToAdd = limit - currentEntriesCount;
    if (entriesToAdd < 1) {
      debug('WARNING_LIST_FULL %o', { offsetNextIndex, limit, currentEntriesCount });
      return [];
    }
    return items.slice(offsetNextIndex, offsetNextIndex + entriesToAdd);
  }

  /*
   * This function builds list and applies all meta data and verification processes.
   */
  _build() {
    this._buildMetadata();
    this._verifyFullList();
  }

  /*
   * This function verifies the list and throws errors if the list is not valid.
   */
  _verifyFullList() {
    listValidation.validateList(this);
  }

  /*
   * This function builds the mandatory metadata object that contains all important meta information for the list. This is done automatically.
   */
  _buildMetadata() {
    this._meta = {
      totalItems: this.items.length,
      totalMatchingItems: Number.isFinite(this.totalMatchingItems) ? this.totalMatchingItems : this.items.length,
      current: {
        offset: this.offset,
        limit: this.limit,
        browseIdentifier: this.browseIdentifier,
      },
    };

    const itemsWithoutSpecialItems = this.items.filter((item) => {
      return !item.isTile && !item.isHeader && !item.isInfoItem && !item.isButton && !item.isIconButton;
    });
    const nextOffset = this.offset + itemsWithoutSpecialItems.length;
    if (Number.isFinite(this.offset) && this._meta.totalMatchingItems > nextOffset) {
      this._meta.next = {
        offset: nextOffset,
        limit: this.limit,
        browseIdentifier: this.browseIdentifier,
      };
    }

    if (this.offset > 0) {
      this._meta.previous = {
        offset: Math.max(this.offset - this.limit, 0),
        limit: Math.min(this.limit, this.offset),
        browseIdentifier: this.browseIdentifier,
      };
    }
  }
};
