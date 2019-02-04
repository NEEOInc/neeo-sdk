import * as Models from '../../models';

export class ListItem {
  public readonly title: string;
  public readonly label?: string;
  public readonly thumbnailUri?: string;
  public readonly browseIdentifier?: string;
  public readonly actionIdentifier?: string;
  public readonly uiAction?: Models.ListUIAction;
  public readonly isQueueable: boolean;

  constructor(params: Models.ListItemParameters = {}) {
    const {
      title,
      label,
      isQueueable,
      thumbnailUri,
      browseIdentifier,
      actionIdentifier,
      uiAction,
    } = params;

    this.title = title || '';
    this.label = label;
    this.isQueueable = isQueueable === true;
    this.thumbnailUri = thumbnailUri;
    this.browseIdentifier = browseIdentifier;
    this.actionIdentifier = actionIdentifier;

    if (uiAction) {
      this.uiAction = uiAction;
    }
  }
}
