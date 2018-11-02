export interface DiscoveryResult {
  readonly id: string;
  readonly name: string;
  readonly reachable?: boolean;
}

export namespace DiscoveryResult {
  export type Controller = (
    optionalDeviceId?: string
  ) => ReadonlyArray<DiscoveryResult> | PromiseLike<ReadonlyArray<DiscoveryResult>>;
}
