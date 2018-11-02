import * as Models from '../../models';
import { Database } from '../database';
interface Device {
    handler: any;
    deviceId: string;
    body?: any;
}
export declare class RequestHandler {
    readonly deviceDatabase: Database;
    static build(deviceDatabase: Database): RequestHandler;
    readonly discoveredDynamicDevices: Map<string, Device>;
    constructor(deviceDatabase: Database);
    searchDevice(query: string): Models.DeviceModel[];
    getDevice(id: number): Models.DeviceModel;
    getAdapterDefinition(adapterName: string): Models.DeviceModel;
    getDeviceByAdapterId(adapterId: string): Promise<Models.DeviceAdapterModel>;
    registerDiscoveredDevice(deviceId: string, device: Device): void;
    getDiscoveredDeviceComponentHandler(deviceId: any, componentName: any): any;
    discover(handler: {
        controller: any;
    }, optionalDeviceId?: string): Promise<any>;
    isRegistered(handler: Models.CapabilityHandler | undefined): Promise<any>;
    register(handler: Models.CapabilityHandler, userdata: any): Promise<any>;
    handleAction(device: {
        handler: Models.CapabilityHandler;
        deviceid: string;
        body?: any;
    }): Promise<any>;
    handleGet(device: {
        deviceid: string;
        handler: Models.CapabilityHandler;
        body?: any;
    }): Promise<any>;
    handleSet(device: {
        deviceid: string;
        handler: Models.CapabilityHandler;
        value: any;
    }): Promise<{
        success: boolean;
    }>;
    subscribe(handler: Models.CapabilityHandler, deviceId: string): Promise<{
        success: boolean;
    }>;
    unsubscribe(handler: Models.CapabilityHandler, deviceId: string): Promise<{
        success: boolean;
    }>;
}
export {};
