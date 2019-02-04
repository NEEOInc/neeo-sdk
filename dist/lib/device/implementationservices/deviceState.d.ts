import * as Models from '../../models';
export default class implements Models.DeviceState {
    private readonly cacheTimeMs;
    private readonly deviceMap;
    private stateChangeCallback?;
    constructor(cacheTimeMs?: number);
    addDevice(id: number, clientObject: object, reachable?: boolean): void;
    registerStateUpdate(callback: Models.StateChangeCallback): void;
    getAllDevices(): {
        clientObject: object;
        promiseCache: Models.PromiseCache;
        reachable: boolean;
        id: number;
    }[];
    isDeviceRegistered(id: number): boolean;
    isReachable(id: number): boolean;
    getClientObjectIfReachable(id: number): object | undefined;
    getCachePromise(id: number): Models.PromiseCache | Promise<never>;
    updateReachable(id: number, reachable: boolean): void;
}
