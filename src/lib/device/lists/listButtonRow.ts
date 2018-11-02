import * as Models from '../../models';
import * as listValidation from '../validation/list';
import { ListButton } from './listButton';

export class ListButtonRow {
  constructor(private readonly buttonDefinitions: ReadonlyArray<Models.ListButtonParameters>) {
    listValidation.validateRow(buttonDefinitions, 'buttons');
  }

  public getButtons() {
    return {
      buttons: this.buttonDefinitions.map((params) => new ListButton(params)),
    };
  }
}
