export function switchGet(
  handler: (deviceId: string) => boolean | PromiseLike<boolean>,
  deviceId: string
) {
  return Promise.resolve(handler(deviceId)).then((result) => {
    return { value: result };
  });
}

export function switchSet(
  handler: (deviceId: string, value: boolean) => void | PromiseLike<void>,
  value: boolean,
  deviceId: string
) {
  return Promise.resolve(handler(deviceId, value)).then(() => {
    return { success: true };
  });
}
