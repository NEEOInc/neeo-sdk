import { DeviceSetup } from './deviceSetup';
import { DeviceTiming } from './deviceTiming';
import { DeviceType } from './deviceType';
export interface DeviceModel {
    readonly id: string | number;
    readonly adapterName: string;
    readonly type: DeviceType;
    readonly manufacturer: string;
    readonly name: string;
    readonly tokens: string;
    readonly setup: DeviceSetup;
    readonly timing: DeviceTiming;
    readonly capabilities: ReadonlyArray<any>;
    readonly deviceCapabilities: ReadonlyArray<string>;
    readonly icon?: string;
    readonly device: {
        readonly name: string;
        readonly tokens: ReadonlyArray<string>;
        readonly icon?: string;
        readonly specificname?: string;
    };
    readonly driverVersion?: number;
    readonly dataEntryTokens?: ReadonlyArray<string>;
}
