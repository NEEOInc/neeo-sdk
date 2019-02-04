import { Descriptor as BaseDescriptor } from './descriptor';
export interface Descriptor extends BaseDescriptor {
    readonly isLabelVisible?: boolean;
}
export declare type Controller = (deviceId: string) => string | PromiseLike<string>;
