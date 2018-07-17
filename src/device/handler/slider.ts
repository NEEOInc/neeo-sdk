export type Value = string | number | boolean;

export function sliderGet(
  handler: (deviceId: string) => Value | PromiseLike<Value>,
  deviceId: string
) {
  return Promise.resolve(handler(deviceId)).then(result => {
    return { value: result };
  });
}

export function sliderSet(
  handler: (deviceId: string, value: Value) => void | PromiseLike<void>,
  value: Value,
  deviceId: string
) {
  return Promise.resolve(handler(deviceId, value)).then(() => {
    return { success: true };
  });
}
