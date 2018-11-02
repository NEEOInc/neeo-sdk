import * as Models from '../../models';
import * as listValidation from '../validation/list';
import { ListTile } from './listTile';

export class ListTileRow {
  constructor(private readonly tileDefinitions: ReadonlyArray<Models.ListTileParameters>) {
    listValidation.validateRow(tileDefinitions, 'tiles');
  }

  public getTiles() {
    return {
      tiles: this.tileDefinitions.map((params) => new ListTile(params)),
    };
  }
}
