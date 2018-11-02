import { ExpressBrainDriver } from '../expressBrainDriver';
import * as Models from '../models';
declare const buildDevice: typeof buildCustomDevice;
export { buildDevice };
export declare function buildCustomDevice(adapterName: string, uniqueString?: string): Models.DeviceBuilder;
export declare function buildBrowseList(options: Models.ListBuilder.Parameters): Models.ListBuilder;
export declare function buildDeviceState(cacheTimeMs: number): Models.DeviceState;
export declare function startServer(conf: Models.StartServerConfig, driver: ExpressBrainDriver): any;
export declare function stopServer(conf: Models.StopServerConfig): any;
