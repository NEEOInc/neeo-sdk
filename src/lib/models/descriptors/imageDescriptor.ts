import { Descriptor as BaseDescriptor } from './descriptor';

export interface Descriptor extends BaseDescriptor {
  readonly size: 'small' | 'large';
  readonly uri?: string;
}
export type Controller = (deviceId: string) => string | PromiseLike<string>;
