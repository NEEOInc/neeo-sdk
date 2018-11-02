import { MessageModel } from './message';
export declare type SubscriptionFunction = (updateCallback: SubscriptionFunction.UpdateCallback, optionalCallbacks: SubscriptionFunction.PowerCallbacks) => void;
export declare namespace SubscriptionFunction {
    type UpdateCallback = (target: MessageModel) => Promise<any>;
    type PowerNotificationFunction = (deviceId: string) => Promise<void>;
    interface PowerCallbacks {
        powerOnNotificationFunction?: PowerNotificationFunction;
        powerOffNotificationFunction?: PowerNotificationFunction;
    }
}
