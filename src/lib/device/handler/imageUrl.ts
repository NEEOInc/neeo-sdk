export function getImageUri(
  handler: (deviceId: string) => string | PromiseLike<string>,
  deviceId: string
) {
  return Promise.resolve(handler(deviceId)).then((result) => {
    return { value: result };
  });
}
