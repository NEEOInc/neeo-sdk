import * as Models from '../../models';
export declare class ListTile {
    readonly isTile: boolean;
    readonly isQueueable: boolean;
    readonly thumbnailUri: string;
    readonly actionIdentifier?: string;
    readonly uiAction?: Models.ListUIAction;
    constructor(params: Models.ListTileParameters);
}
