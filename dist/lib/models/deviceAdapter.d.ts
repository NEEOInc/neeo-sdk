import { CapabilityHandler } from './capabilityHandler';
import { Subscription } from './descriptors';
import { DeviceSetup } from './deviceSetup';
import { DeviceTiming } from './deviceTiming';
import { DeviceType } from './deviceType';
import { InitialiseFunction } from './initialiseFunction';
export interface DeviceAdapterModel {
    readonly adapterName: string;
    readonly apiversion: string;
    readonly type: DeviceType;
    readonly manufacturer: string;
    readonly devices: ReadonlyArray<{
        readonly name: string;
        readonly tokens: ReadonlyArray<string>;
        readonly specificname?: string;
        readonly icon?: string;
    }>;
    readonly capabilities: ReadonlyArray<any>;
    readonly handler: ReadonlyMap<string, CapabilityHandler>;
    readonly deviceCapabilities: ReadonlyArray<string>;
    readonly subscriptionFunction?: Subscription.Controller;
    readonly initialiseFunction?: InitialiseFunction;
    readonly timing?: DeviceTiming;
    readonly setup: DeviceSetup;
    readonly driverVersion?: number;
}
