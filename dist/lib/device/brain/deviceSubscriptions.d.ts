export interface BrainDeviceSubscriptionOptions {
    adapterName: string;
    url: string;
}
export default class BrainDeviceSubscriptions {
    static build(options: BrainDeviceSubscriptionOptions): BrainDeviceSubscriptions;
    readonly adapterName: string;
    readonly subscriptionsUri: string;
    readonly cache: Map<number, any>;
    constructor(options: BrainDeviceSubscriptionOptions);
    getSubscriptions(deviceId: string): Promise<any>;
}
