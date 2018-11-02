import { ListButtonParameters } from './listButtonParameters';
import { ListInfoItemParameters } from './listInfoItemParameters';
import { ListItemParameters } from './listItemParameters';
import { ListTileParameters } from './listTileParameters';
import { ListUIAction } from './listUIAction';
export declare namespace ListBuilder {
    interface Item {
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
    interface Metadata {
        totalItems?: number;
        totalMatchingItems?: number;
        current?: Metadatum;
        next?: Metadatum;
        previous?: Metadatum;
    }
    interface Metadatum {
        browseIdentifier?: string;
        offset?: number;
        limit?: number;
    }
    interface Parameters {
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
    addListHeader(title: string): this;
    addListItem(item: ListItemParameters): this;
    setListTitle(name: string): this;
    setTotalMatchingItems(totalMatchingItems: number): this;
    addListItems(rawItems: ReadonlyArray<ListItemParameters>): this;
    addListTiles(params: ReadonlyArray<ListTileParameters>): this;
    addListInfoItem(params: ListInfoItemParameters): this;
    addListButtons(params: ReadonlyArray<ListButtonParameters>): this;
}
