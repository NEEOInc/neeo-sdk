import * as Models from '../../models';
import { Database } from '../database';
interface Device {
    handler: any;
    deviceId: string;
    body?: any;
}
interface DeviceRequestModel {
    deviceid: string;
    handler: Models.CapabilityHandler;
    body?: any;
    value?: any;
}
export declare class RequestHandler {
    readonly deviceDatabase: Database;
    static build(deviceDatabase: Database): RequestHandler;
    readonly discoveredDynamicDevices: Map<string, Device>;
    constructor(deviceDatabase: Database);
    searchDevice(query: string): any;
    getDevice(id: number): Models.DeviceModel;
    getAdapterDefinition(adapterName: string): Models.DeviceModel;
    getDeviceByAdapterId(adapterId: string): Promise<Models.DeviceAdapterModel>;
    registerDiscoveredDevice(deviceId: string, device: Device): void;
    getDiscoveredDeviceComponentHandler(deviceId: any, componentName: any): any;
    discover(handler: {
        controller: any;
    }, optionalDeviceId?: string): any;
    isRegistered(handler: Models.CapabilityHandler | undefined): any;
    register(handler: Models.CapabilityHandler, userdata: any): any;
    handleAction(device: DeviceRequestModel): Promise<any>;
    handleGet(device: DeviceRequestModel): Promise<any>;
    handleSet(device: DeviceRequestModel): any;
    subscribe(handler: Models.CapabilityHandler, deviceId: string): any;
    unsubscribe(handler: Models.CapabilityHandler, deviceId: string): any;
}
export {};
