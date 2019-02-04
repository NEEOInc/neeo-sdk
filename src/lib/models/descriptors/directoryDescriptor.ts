import { ListBuilder } from '../lists/listBuilder';
import { Descriptor as BaseDescriptor } from './descriptor';

export interface Descriptor extends BaseDescriptor {
  role?: string;
  identifier?: string;
}

export interface BrowseParameters {
  browseIdentifier: string;
  limit?: number;
  offset?: number;
}

export interface Controller {
  getter: (deviceId: string, params: BrowseParameters) => ListBuilder | PromiseLike<ListBuilder>;
  action: (deviceId: string, params: object) => void | PromiseLike<void>;
}
