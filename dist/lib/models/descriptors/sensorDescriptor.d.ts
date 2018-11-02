import { Descriptor } from './descriptor';
export interface SensorDescriptor extends Descriptor {
    readonly type?: string;
    readonly range?: ReadonlyArray<number>;
    readonly unit?: string;
    readonly sensorlabel?: string;
}
export declare namespace SensorDescriptor {
    type SensorValue = number | string | boolean;
    interface Controller {
        getter(deviceId: string): SensorValue | PromiseLike<SensorValue>;
    }
    interface PowerStateController {
        getter(deviceId: string): boolean | PromiseLike<boolean>;
    }
}
