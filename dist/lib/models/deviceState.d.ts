import { PromiseCache } from './promiseCache';
export declare type StateChangeCallback = (id: number, clientObject: object) => void | PromiseLike<void>;
export interface DeviceState {
    addDevice(id: number, clientObject: any, reachable?: boolean): void;
    isDeviceRegistered(id: number): boolean;
    isReachable(id: number): boolean;
    getClientObjectIfReachable(id: number): any;
    getAllDevices(): ReadonlyArray<{
        readonly id: number;
        readonly clientObject: any;
        readonly reachable: boolean;
        readonly promiseCache: PromiseCache;
    }>;
    getCachePromise(id: number): PromiseCache | Promise<never>;
    updateReachable(id: number, reachable: boolean): void;
    registerStateUpdate(callback: StateChangeCallback): void;
}
