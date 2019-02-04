export declare type Value = string | number | boolean;
export declare function sliderGet(handler: (deviceId: string) => Value | PromiseLike<Value>, deviceId: string): Promise<{
    value: string | number | boolean;
}>;
export declare function sliderSet(handler: (deviceId: string, value: Value) => void | PromiseLike<void>, value: Value, deviceId: string): Promise<{
    success: boolean;
}>;
