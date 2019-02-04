import * as Models from '../../models';
import { ListItem } from './listItem';
export declare class ListInfoItem extends ListItem {
    readonly isInfoItem: boolean;
    readonly text?: string;
    readonly affirmativeButtonText?: string;
    readonly negativeButtonText?: string;
    constructor(params: Models.ListInfoItemParameters);
}
