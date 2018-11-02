import { CapabilityHandler } from './capabilityHandler';
import { Component } from './components';
import { DeviceSetup } from './deviceSetup';
import { DeviceTiming } from './deviceTiming';
import { DeviceTypes } from './deviceTypes';
import { InitialiseFunction } from './initialiseFunction';
import { SubscriptionFunction } from './subscriptionFunction';

export interface DeviceAdapterModel {
  readonly adapterName: string;
  readonly apiversion: string;
  readonly type: DeviceTypes;
  readonly manufacturer: string;
  readonly devices: ReadonlyArray<{
    readonly name: string;
    readonly tokens: ReadonlyArray<string>;
    readonly specificname?: string;
    readonly icon?: string;
  }>;
  readonly capabilities: ReadonlyArray<Component>;
  readonly handler: ReadonlyMap<string, CapabilityHandler>;
  readonly deviceCapabilities: ReadonlyArray<string>;
  readonly subscriptionFunction?: SubscriptionFunction;
  readonly initialiseFunction?: InitialiseFunction;
  readonly timing?: DeviceTiming;
  readonly setup: DeviceSetup;
  readonly driverVersion?: number;
}
