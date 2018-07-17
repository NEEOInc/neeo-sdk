export interface DirectoryFunction<T> {
  (deviceId: string, params: any): T | PromiseLike<T>;
}

export function directoryGet(
  handler: DirectoryFunction<ReadonlyArray<any>>,
  deviceId: string,
  params: any
) {
  return Promise.resolve(handler(deviceId, params)).then(browseResult => {
    if (!browseResult) {
      const error = new Error('DIRECTORY_NO_BROWSERESULT_RETURNED_FROM_GETTER');
      console.error(error);
      throw error;
    }
    return browseResult;
  });
}

export function callAction(
  handler: DirectoryFunction<void>,
  deviceId: string,
  params: any
) {
  return Promise.resolve(handler(deviceId, params));
}
