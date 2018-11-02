export interface DiscoveryResult {
    readonly id: string;
    readonly name: string;
    readonly reachable?: boolean;
}
export declare namespace DiscoveryResult {
    type Controller = (optionalDeviceId?: string) => ReadonlyArray<DiscoveryResult> | PromiseLike<ReadonlyArray<DiscoveryResult>>;
}
