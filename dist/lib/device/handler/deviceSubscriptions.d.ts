export declare type DeviceSubscriptionHandler = (deviceId: string) => void | PromiseLike<void>;
export declare function deviceAdded(handler: DeviceSubscriptionHandler, deviceId: string): Promise<{
    success: boolean;
}>;
export declare function deviceRemoved(handler: DeviceSubscriptionHandler, deviceId: string): Promise<{
    success: boolean;
}>;
