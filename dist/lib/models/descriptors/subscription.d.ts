import { MessageModel } from '../message';
export declare type Controller = (updateCallback: UpdateCallback, optionalCallbacks: PowerCallbacks) => void;
export declare type UpdateCallback = (target: MessageModel) => Promise<any>;
export declare type PowerNotificationFunction = (deviceId: string) => Promise<void>;
export interface PowerCallbacks {
    powerOnNotificationFunction?: PowerNotificationFunction;
    powerOffNotificationFunction?: PowerNotificationFunction;
}
