import { Descriptor } from './descriptor';
import { ListBuilder } from '../lists/listBuilder';

export interface DirectoryDescriptor extends Descriptor {
  /**
   * Directory used for a queue (mediaplayer only).
   */
  isQueue?: boolean;
  /**
   * Directory which will be the root level of the list.
   */
  isRoot?: boolean;
  /**
   * Optional identifier for the directory.
   */
  identifier?: string;
}

export namespace DirectoryDescriptor {
  export interface Controller {
    /**
     * Should return a list built by listBuilder so the App/NEEO Remote can display the browse result as a list.
     * If the getter callback encounters an error, you can build a list with a 'ListInfoItem' to inform the user about the error.
     */
    getter: (
      deviceId: string,
      params: { browseIdentifier: string; limit?: number; offset?: number }
    ) => ListBuilder | PromiseLike<ListBuilder>;
    /**
     * Will be called when an item is clicked.
     */
    action: (deviceId: string, params: object) => void | PromiseLike<void>;
  }
}
