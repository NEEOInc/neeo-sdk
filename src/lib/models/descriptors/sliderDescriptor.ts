import { Descriptor as BaseDescriptor } from './descriptor';

export interface Descriptor extends BaseDescriptor {
  readonly range?: ReadonlyArray<number>;
  readonly unit?: string;
}
export interface Controller {
  setter(deviceId: string, value: number): void | PromiseLike<void>;
  getter(deviceId: string): number | PromiseLike<number>;
}
