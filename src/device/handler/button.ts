export function trigger(
  deviceId: string,
  handler: (deviceId: string) => void | PromiseLike<void>
) {
  return Promise.resolve(handler(deviceId)).then(() => {
    return { success: true };
  });
}
