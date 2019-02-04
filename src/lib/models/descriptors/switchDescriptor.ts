export interface Controller {
  setter(deviceId: string, value: boolean): void | PromiseLike<void>;
  getter(deviceId: string): boolean | PromiseLike<boolean>;
}
