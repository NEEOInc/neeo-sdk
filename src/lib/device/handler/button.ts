import * as BluePromise from 'bluebird';

export function trigger(deviceId: string, handler: (deviceId: string) => void | PromiseLike<void>) {
  return BluePromise.resolve(handler(deviceId)).then(() => {
    return { success: true };
  });
}
