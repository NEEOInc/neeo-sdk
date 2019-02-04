export interface Controller {
  deviceAdded: (deviceId: string) => void | PromiseLike<void>;
  deviceRemoved: (deviceId: string) => void | PromiseLike<void>;
  initializeDeviceList: (deviceIds: ReadonlyArray<string>) => void | PromiseLike<void>;
}
