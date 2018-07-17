import { ListItem } from './listItem';
import * as Models from '../../models';

export class ListInfoItem extends ListItem {
  readonly isInfoItem = true;
  readonly text?: string;
  readonly affirmativeButtonText?: string;
  readonly negativeButtonText?: string;

  constructor(params: Models.ListInfoItemParameters) {
    super(params);
    ({
      text: this.text,
      affirmativeButtonText: this.affirmativeButtonText,
      negativeButtonText: this.negativeButtonText
    } = params);
  }
}
