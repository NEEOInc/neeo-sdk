export interface ListTileParameters {
  /**
   * Optional, URL that points to an image that will be displayed on the list item
   */
  thumbnailUri: string;
  isQueueable?: boolean;
  actionIdentifier?: string;
}
