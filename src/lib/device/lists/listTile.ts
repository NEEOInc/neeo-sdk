import * as Models from '../../models';

export class ListTile {
  public readonly isTile = true;
  public readonly isQueueable: boolean;
  public readonly thumbnailUri: string;
  public readonly actionIdentifier?: string;
  public readonly uiAction?: Models.ListUIAction;

  constructor(params: Models.ListTileParameters) {
    if (!params) {
      throw new Error('LIST_TILE_MISSING_PARAMS');
    }
    const { thumbnailUri, isQueueable, actionIdentifier, uiAction } = params;
    this.thumbnailUri = thumbnailUri;
    this.isQueueable = isQueueable === true;
    this.actionIdentifier = actionIdentifier;

    if (uiAction) {
      this.uiAction = uiAction;
    }
  }
}
