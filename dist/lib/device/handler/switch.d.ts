export declare function switchGet(handler: (deviceId: string) => boolean | PromiseLike<boolean>, deviceId: string): Promise<{
    value: boolean;
}>;
export declare function switchSet(handler: (deviceId: string, value: boolean) => void | PromiseLike<void>, value: boolean, deviceId: string): Promise<{
    success: boolean;
}>;
