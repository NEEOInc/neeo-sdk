import { Descriptor } from './descriptor';

export interface SwitchDescriptor extends Descriptor {}

export namespace SwitchDescriptor {
  export interface Controller {
    setter(deviceId: string, value: boolean): void | PromiseLike<void>;
    getter(deviceId: string): boolean | PromiseLike<boolean>;
  }
}
