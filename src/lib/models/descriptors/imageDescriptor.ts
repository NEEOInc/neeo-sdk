import { Descriptor } from './descriptor';

export interface ImageDescriptor extends Descriptor {
  readonly size: 'small' | 'large';
  readonly uri?: string;
}

export namespace ImageDescriptor {
  export type Controller = (deviceId: string) => string | PromiseLike<string>;
}
