export interface DiscoveryResult {
  readonly id: string;
  readonly name: string;
  readonly reachable?: boolean;
}

export namespace DiscoveryResult {
  export type Controller = () =>
    | ReadonlyArray<DiscoveryResult>
    | PromiseLike<ReadonlyArray<DiscoveryResult>>;
}
