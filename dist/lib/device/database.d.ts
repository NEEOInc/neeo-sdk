import * as Models from '../models';
export declare class Database {
    static build(adapters: ReadonlyArray<Models.DeviceAdapterModel>): Database;
    private readonly initializedDevices;
    private readonly devices;
    private readonly deviceMap;
    private readonly deviceIndex;
    constructor(adapters: ReadonlyArray<Models.DeviceAdapterModel>);
    search(query?: string): any;
    getDevice(id: number): Models.DeviceModel;
    getAdapterDefinition(adapterName: string): Models.DeviceModel;
    getDeviceByAdapterId(adapterId: string): Promise<Models.DeviceAdapterModel>;
    private lazyInitialize;
}
