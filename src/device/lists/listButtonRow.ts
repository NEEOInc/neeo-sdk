import * as listValidation from '../validation/list';
import * as Models from '../../models';
import { ListButton } from './listButton';

export class ListButtonRow {
  constructor(
    private readonly buttonDefinitions: ReadonlyArray<
      Models.ListButtonParameters
    >
  ) {
    listValidation.validateRow(buttonDefinitions, 'buttons');
  }

  getButtons() {
    return {
      buttons: this.buttonDefinitions.map(params => new ListButton(params))
    };
  }
}
