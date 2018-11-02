import { Descriptor } from './descriptor';

export interface TextLabelDescriptor extends Descriptor {
  readonly isLabelVisible?: boolean;
}

export namespace TextLabelDescriptor {
  export type Controller = (deviceId: string) => string | PromiseLike<string>;
}
