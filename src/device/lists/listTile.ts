import * as listValidation from '../validation/list';
import * as Models from '../../models';

export class ListTile {
  readonly isTile = true;
  readonly isQueueable: boolean;
  readonly thumbnailUri: string;
  readonly actionIdentifier?: string;

  constructor(params: Models.ListTileParameters) {
    if (!params) {
      throw new Error('LIST_TILE_MISSING_PARAMS');
    }
    const { thumbnailUri, isQueueable, actionIdentifier } = params;
    this.thumbnailUri = listValidation.validateThumbnail(thumbnailUri);
    this.isQueueable = isQueueable === true;
    this.actionIdentifier = actionIdentifier;
  }
}
