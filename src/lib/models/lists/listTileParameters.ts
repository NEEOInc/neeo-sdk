import { ListUIAction } from './listUIAction';

export interface ListTileParameters {
  thumbnailUri: string;
  isQueueable?: boolean;
  actionIdentifier?: string;
  uiAction?: ListUIAction;
}
