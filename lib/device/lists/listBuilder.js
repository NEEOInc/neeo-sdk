'use strict';

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
 * @param {String} options.title title of the list
 * @param {Number} options.totalMatchingItems how many results the query included in total (used for pagination)
 * @param {Number} options.limit optional, how many items should be queried per page (used for pagination). The default and maximum is 64.
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
  constructor(options) {
    if (!options) {
      throw new Error('ERROR_LIST_NO_OPTIONS_PROVIDED');
    }

    this.title = listValidation.validateTitle(options.title);
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
   * @function addListItem
   * @description This function adds an item to the list.
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
  addListItem(params) {
    listValidation.validateItemParams(params);
    const listItem = new ListItem(params);
    this.items.push(listItem);
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
   * @param {String} configuration.title title that will be shown on the list item entry
   * @param {String} configuration.actionIdentifier optional, string passed back to handling function when button is clicked
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListButtons([{
   *      title: 'Shuffle',
   *      actionIdentifier: 'ROW1_BUTTON1',
   *    }])
   *    .addListButtons([{
   *      title: 'Repeat',
   *      actionIdentifier: 'ROW2_BUTTON1',
   *    }, {
   *      title: 'Play All',
   *      actionIdentifier: 'ROW2_BUTTON1',
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
  prepareItemsAccordingToOffsetAndLimit(files) {
    const offset = this.offset ? this.offset : 0;
    const limit = this.limit ? this.limit : config.maxListItemsPerPage;

    return files.slice(offset, offset + limit);
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
      }
    };

    const itemsWithoutSpecialItems = this.items.filter((item) => {
      return !item.isTile && !item.isHeader && !item.isInfoItem && !item.isButton;
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
