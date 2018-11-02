import * as Models from '../../models';
import { ListTile } from './listTile';
export declare class ListTileRow {
    private readonly tileDefinitions;
    constructor(tileDefinitions: ReadonlyArray<Models.ListTileParameters>);
    getTiles(): {
        tiles: ListTile[];
    };
}
