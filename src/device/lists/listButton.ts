import * as listValidation from '../validation/list';
import * as Models from '../../models';

export class ListButton {
  readonly isButton = true;
  readonly title?: string;
  readonly iconName: string;
  readonly inverse: boolean;
  readonly actionIdentifier?: string;

  constructor(params: Models.ListButtonParameters) {
    if (!params) {
      throw new Error('LIST_BUTTON_PARAMS_MISSING');
    }
    let iconName: string;
    ({
      iconName,
      title: this.title,
      inverse: this.inverse,
      actionIdentifier: this.actionIdentifier
    } = params);
    this.iconName = listValidation.validateButtonIcon(iconName)!;
  }
}
