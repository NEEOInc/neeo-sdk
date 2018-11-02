export interface CapabilityHandler {
  readonly componenttype: string;
  readonly controller: {
    getter: (deviceId: string) => any;
    setter?: (deviceId: string, value: any) => void | PromiseLike<void>;
    action?: any;
  };
}
