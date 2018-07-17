import { ListItemParameters } from './listItemParameters';
import { ListTileParameters } from './listTileParameters';
import { ListInfoItemParameters } from './listInfoItemParameters';
import { ListButtonParameters } from './listButtonParameters';

/**
 * A browsable list that can be used for a specific device.
 * An example can be a browsable playlist.
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

/**
 * A browsable list that can be used for a specific device.
 * An example can be a browsable playlist.
 */
export interface ListBuilder {
  readonly items: ReadonlyArray<ListBuilder.Item>;
  readonly title: string;
  readonly _meta: ListBuilder.Metadata;

  /**
   * This function adds a header to the list, which can be used as a visual separator. A ListHeader is a pure visual informational object.
   * @param title title that will be shown on the list item entry.
   * @return ListBuilder for chaining.
   * @example
   *    .addListHeader('My Header');
   */
  addListHeader(title: string): this;

  /**
   * This function adds an item to the list.
   * @param params JSON Configuration Object.
   * @return ListBuilder for chaining.
   * @example
   *    .addListItem({
   *      title: 'First List Item',
   *      thumbnailUri: 'https://www.image.com/image.jpg'
   *    })
   */
  addListItem(item: ListItemParameters): this;

  /**
   * This function sets the name of the list. The list title is only displayed when you add the directory as shortcut.
   * @param name the list name
   * @return ListBuilder for chaining.
   * @example
   *    .setListTitle('it is a name!')
   */
  setListTitle(name: string): this;

  /**
   * This function updates the totalMatchingItems number of the list (used for pagination).
   * @param totalMatchingItems the total length of the list
   * @return ListBuilder for chaining.
   * @example
   *    .setTotalMatchingItems(100)
   */
  setTotalMatchingItems(totalMatchingItems: number): this;

  /**
   * Add an array of ListItem to a list. this function limits the amount of items to add depending on the options.limit setting (it never adds more than options.limit entires).
   * @param rawItems Array of ListItem JSON elements
   * @return ListBuilder for chaining.
   * @example
   *    .addListItems([
   *      { title: 'foo' },
   *      { title: 'bar' }
   *    ])
   */
  addListItems(rawItems: ReadonlyArray<ListItemParameters>): this;

  /**
   * This function adds a row of tiles to the list. It takes an array of up to two tiles. A ListTile shows a large thumbnail and the defined action will be executed when the ListTile element is selected.
   * @param params Configuration Array.
   * @return ListBuilder for chaining.
   * @example
   *    .addListTile([{
   *      thumbnailUri: 'https://www.image.com/image.jpg',
   *    }])
   */
  addListTiles(params: ReadonlyArray<ListTileParameters>): this;

  addListInfoItem(params: ListInfoItemParameters): this;

  addListButtons(params: ReadonlyArray<ListButtonParameters>): this;
}
