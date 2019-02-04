import { Descriptor as BaseDescriptor } from './descriptor';

export type Value = number | string | boolean;

export interface Descriptor extends BaseDescriptor {
  readonly type?: string;
  readonly range?: ReadonlyArray<number>;
  readonly unit?: string;
  readonly sensorlabel?: string;
}

export interface Controller {
  getter(deviceId: string): Value | PromiseLike<Value>;
}

export interface PowerStateController {
  getter(deviceId: string): boolean | PromiseLike<boolean>;
}
