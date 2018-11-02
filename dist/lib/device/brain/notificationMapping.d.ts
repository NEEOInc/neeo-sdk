export default class {
    private readonly adapterName;
    private readonly brainUri;
    private readonly cache;
    constructor(options: {
        adapterName: string;
        url: string;
    });
    getNotificationKeys(uniqueDeviceId: string, deviceId: string, componentName: string): Promise<any>;
    private findNotificationKeys;
    private fetchDataFromBrain;
}
