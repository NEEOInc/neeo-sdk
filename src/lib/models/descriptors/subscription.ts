import { MessageModel } from '../message';

export type Controller = (
  updateCallback: UpdateCallback,
  optionalCallbacks: PowerCallbacks
) => void;

export type UpdateCallback = (target: MessageModel) => Promise<any>;

export type PowerNotificationFunction = (deviceId: string) => Promise<void>;

export interface PowerCallbacks {
  powerOnNotificationFunction?: PowerNotificationFunction;
  powerOffNotificationFunction?: PowerNotificationFunction;
}
