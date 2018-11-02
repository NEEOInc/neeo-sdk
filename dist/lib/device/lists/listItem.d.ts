import * as Models from '../../models';
export declare class ListItem {
    readonly title: string;
    readonly label?: string;
    readonly thumbnailUri?: string;
    readonly browseIdentifier?: string;
    readonly actionIdentifier?: string;
    readonly uiAction?: Models.ListUIAction;
    readonly isQueueable: boolean;
    constructor(params?: Models.ListItemParameters);
}
