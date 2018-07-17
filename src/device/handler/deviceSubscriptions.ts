import * as Debug from 'debug';

const debug = Debug('neeo:device:express:roout:handler:devicesubscription');

const SUCCESS = () => ({ success: true });

export interface DeviceSubscriptionHandler {
  (deviceId: string): void | PromiseLike<void>;
}

export function deviceAdded(
  handler: DeviceSubscriptionHandler,
  deviceId: string
) {
  debug('device added:', deviceId);
  return Promise.resolve(handler(deviceId)).then(SUCCESS);
}

export function deviceRemoved(
  handler: DeviceSubscriptionHandler,
  deviceId: string
) {
  debug('device removed:', deviceId);
  return Promise.resolve(handler(deviceId)).then(SUCCESS);
}
