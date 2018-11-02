import { ListButtonParameters } from './listButtonParameters';
import { ListInfoItemParameters } from './listInfoItemParameters';
import { ListItemParameters } from './listItemParameters';
import { ListTileParameters } from './listTileParameters';
import { ListUIAction } from './listUIAction';

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
export namespace ListBuilder {
  export interface Item {
    readonly isHeader?: boolean;
    readonly isTile?: boolean;
    readonly isInfoItem?: boolean;
    readonly isButton?: boolean;
    readonly isIconButton?: boolean;
    readonly actionIdentifier?: string;
    readonly browseIdentifier?: string;
    readonly thumbnailUri?: string;
    readonly uiAction?: ListUIAction;
    readonly label?: string;
    readonly title?: string;
    readonly tiles?: any[];
    readonly buttons?: any[];
  }

  export interface Metadata {
    totalItems?: number;
    totalMatchingItems?: number;
    current?: Metadatum;
    next?: Metadatum;
    previous?: Metadatum;
  }

  export interface Metadatum {
    browseIdentifier?: string;
    offset?: number;
    limit?: number;
  }

  export interface Parameters {
    title?: string;
    totalMatchingItems?: number;
    limit?: number;
    offset?: number;
    browseIdentifier?: string;
  }
}

export interface ListBuilder {
  readonly items: ReadonlyArray<ListBuilder.Item>;
  readonly title: string;
  readonly _meta: ListBuilder.Metadata;

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
  addListHeader(title: string): this;

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
   * @param {ListUIAction} configuration.uiAction optional, string representing action GUI should take after item is clicked, can be any of "goToRoot" (going back to the root of the directory), "goBack" (going back one step in history),  "close" (closing the modal), "reload" (reloading the current view with same browseIdentifier)
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListItem({
   *      title: 'First List Item',
   *      thumbnailUri: 'https://www.image.com/image.jpg',
   *      uiAction: 'close',
   *    })
   */
  addListItem(item: ListItemParameters): this;

  /**
   * @function setListTitle
   * @description This function sets the name of the list. The list title is only displayed when you add the directory as shortcut.
   * @param {String} name the list name
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .setListTitle('it is a name!')
   */
  setListTitle(name: string): this;

  /**
   * @function setTotalMatchingItems
   * @description This function updates the totalMatchingItems number of the list (used for pagination).
   * @param {Integer} totalMatchingItems the total length of the list
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .setTotalMatchingItems(100)
   */
  setTotalMatchingItems(totalMatchingItems: number): this;

  /**
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
  addListItems(rawItems: ReadonlyArray<ListItemParameters>): this;

  /**
   * @function addListTiles
   * @description This function adds a row of tiles to the list. It takes an array of up to two tiles. A ListTile shows a large thumbnail and the defined action will be executed when the ListTile element is selected.
   * To avoid downloading and resizing large images on the Brain you should provide an image of 215x215px.
   * These guidelines are specifically for the remote, a larger (maybe double) resolution might offer a good compromise for mobile devices.
   * @param {Array} configuration Configuration Array
   * @param {String} configuration.thumbnailUri optional, URL that points to an image that will be displayed on the list item
   * @param {String} configuration.actionIdentifier optional, string passed back to handling function when item is clicked
   * @param {ListUIAction} configuration.uiAction optional, string representing action GUI should take after the tile is clicked, can be any of "goToRoot" (going back to the root of the directory), "goBack" (going back one step in history), "close" (closing the modal), "reload" (reloading the current view with same browseIdentifier)
   * @return {ListBuilder} ListBuilder for chaining.
   * @example
   *    .addListTile([{
   *      thumbnailUri: 'https://www.image.com/image.jpg',
   *      uiAction: 'reload'
   *    }])
   */
  addListTiles(params: ReadonlyArray<ListTileParameters>): this;

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
  addListInfoItem(params: ListInfoItemParameters): this;

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
  addListButtons(params: ReadonlyArray<ListButtonParameters>): this;
}
