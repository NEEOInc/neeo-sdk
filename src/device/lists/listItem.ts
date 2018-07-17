import * as listValidation from '../validation/list';
import * as Models from '../../models';

export class ListItem {
  readonly title: string;
  readonly label?: string;
  readonly thumbnailUri?: string;
  readonly browseIdentifier?: string;
  readonly actionIdentifier?: string;
  readonly isQueueable: boolean;

  constructor(params: Models.ListItemParameters) {
    if (!params) {
      throw new Error('LIST_ITEM_MISSING_PARAMS');
    }
    const {
      title,
      label,
      isQueueable,
      thumbnailUri,
      browseIdentifier,
      actionIdentifier
    } = params;
    this.title = listValidation.validateTitle(title);
    this.label = label;
    this.isQueueable = isQueueable === true;
    this.thumbnailUri = thumbnailUri;
    this.browseIdentifier = browseIdentifier;
    this.actionIdentifier = actionIdentifier;
  }
}
