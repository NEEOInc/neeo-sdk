export declare function getText(handler: (deviceId: string) => string | PromiseLike<string>, deviceId: string): Promise<{
    value: string;
}>;
