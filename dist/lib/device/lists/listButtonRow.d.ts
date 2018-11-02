import * as Models from '../../models';
import { ListButton } from './listButton';
export declare class ListButtonRow {
    private readonly buttonDefinitions;
    constructor(buttonDefinitions: ReadonlyArray<Models.ListButtonParameters>);
    getButtons(): {
        buttons: ListButton[];
    };
}
