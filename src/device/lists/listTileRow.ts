import { ListTile } from './listTile';
import * as listValidation from '../validation/list';
import * as Models from '../../models';

export class ListTileRow {
  constructor(
    private readonly tileDefinitions: ReadonlyArray<Models.ListTileParameters>
  ) {
    listValidation.validateRow(tileDefinitions, 'tiles');
  }

  getTiles() {
    return {
      tiles: this.tileDefinitions.map(params => new ListTile(params))
    };
  }
}
