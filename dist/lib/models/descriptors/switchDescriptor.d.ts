import { Descriptor } from './descriptor';
export interface SwitchDescriptor extends Descriptor {
}
export declare namespace SwitchDescriptor {
    interface Controller {
        setter(deviceId: string, value: boolean): void | PromiseLike<void>;
        getter(deviceId: string): boolean | PromiseLike<boolean>;
    }
}
