import { Descriptor } from './descriptor';
export interface TextLabelDescriptor extends Descriptor {
    readonly isLabelVisible?: boolean;
}
export declare namespace TextLabelDescriptor {
    type Controller = (deviceId: string) => string | PromiseLike<string>;
}
