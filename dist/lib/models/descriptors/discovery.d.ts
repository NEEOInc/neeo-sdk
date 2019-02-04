export interface Result {
    readonly id: string;
    readonly name: string;
    readonly reachable?: boolean;
}
export declare type Controller = (optionalDeviceId?: string) => ReadonlyArray<Result> | PromiseLike<ReadonlyArray<Result>>;
export interface Options {
    headerText?: string;
    description?: string;
    enableDynamicDeviceBuilder?: boolean;
}
