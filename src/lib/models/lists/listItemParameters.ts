import { ListUIAction } from './listUIAction';

export interface ListItemParameters {
  title?: string;
  label?: string;
  isQueueable?: boolean;
  thumbnailUri?: string;
  browseIdentifier?: string;
  actionIdentifier?: string;
  uiAction?: ListUIAction;
}
