import { Descriptor } from './descriptor';

export interface SensorDescriptor extends Descriptor {
  readonly type: string;
  readonly range?: ReadonlyArray<number>;
  readonly unit?: string;
  readonly sensorlabel?: string;
}

export namespace SensorDescriptor {
  export type SensorValue = number | string | boolean;

  export interface Controller {
    getter(deviceId: string): SensorValue | PromiseLike<SensorValue>;
  }

  export interface PowerStateController {
    getter(deviceId: string): boolean | PromiseLike<boolean>;
  }
}
