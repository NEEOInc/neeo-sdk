import { ListBuilder } from '../lists/listBuilder';
import { Descriptor } from './descriptor';

export interface DirectoryDescriptor extends Descriptor {
  role?: string;
  identifier?: string;
}

export namespace DirectoryDescriptor {
  export interface Controller {
    getter: (
      deviceId: string,
      params: { browseIdentifier: string; limit?: number; offset?: number }
    ) => ListBuilder | PromiseLike<ListBuilder>;
    action: (deviceId: string, params: object) => void | PromiseLike<void>;
  }
}
