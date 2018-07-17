import { MessageModel } from './message';

export interface SubscriptionFunction {
  (
    updateCallback: SubscriptionFunction.UpdateCallback,
    optionalCallbacks: SubscriptionFunction.PowerCallbacks
  ): void;
}

export namespace SubscriptionFunction {
  export type UpdateCallback = (target: MessageModel) => Promise<any>;

  export type PowerNotificationFunction = (deviceId: string) => Promise<void>;

  export type PowerCallbacks = {
    powerOnNotificationFunction?: PowerNotificationFunction;
    powerOffNotificationFunction?: PowerNotificationFunction;
  };
}
