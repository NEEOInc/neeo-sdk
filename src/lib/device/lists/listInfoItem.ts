import * as Models from '../../models';
import { ListItem } from './listItem';

export class ListInfoItem extends ListItem {
  public readonly isInfoItem = true;
  public readonly text?: string;
  public readonly affirmativeButtonText?: string;
  public readonly negativeButtonText?: string;

  constructor(params: Models.ListInfoItemParameters) {
    super(params);
    ({
      text: this.text,
      affirmativeButtonText: this.affirmativeButtonText,
      // tslint:disable-next-line
      negativeButtonText: this.negativeButtonText
    } = params);
  }
}
