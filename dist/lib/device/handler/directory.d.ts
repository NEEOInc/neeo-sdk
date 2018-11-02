export declare type DirectoryFunction<T> = (deviceId: string, params: any) => T | PromiseLike<T>;
export declare function directoryGet(handler: DirectoryFunction<ReadonlyArray<any>>, deviceId: string, params: any): Promise<ReadonlyArray<any>>;
export declare function callAction(handler: DirectoryFunction<void>, deviceId: string, params: any): Promise<void>;
