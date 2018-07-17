/**
 * JSON Configuration item for a ListItem.
 */
export interface ListItemParameters {
  /**
   * Title that will be shown on the list item entry.
   */
  title: string;
  /**
   * Optional, additional label.
   */
  label?: string;
  isQueueable?: boolean;
  /**
   * Optional, URL that points to an image that will be displayed on the list item.
   */
  thumbnailUri?: string;
  /**
   * Optional, identifier that is passed with a browse request to identify which "path" should be browsed.
   */
  browseIdentifier?: string;
  /**
   * Optional, string passed back to handling function when item is clicked.
   */
  actionIdentifier?: string;
}
