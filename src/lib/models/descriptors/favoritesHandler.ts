export interface Controller {
  execute: (deviceId: string, channelNr: string) => void | PromiseLike<void>;
}
