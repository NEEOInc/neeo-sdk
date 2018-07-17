import { DeviceTypes } from './deviceTypes';
import { DeviceSetup } from './deviceSetup';
import { DeviceTiming } from './deviceTiming';
import { Component } from './components';

export interface DeviceModel {
  readonly id: string | number;
  readonly adapterName: string;
  readonly type: DeviceTypes;
  readonly manufacturer: string;
  readonly name: string;
  readonly tokens: string;
  readonly setup: DeviceSetup;
  readonly timing: DeviceTiming;
  readonly capabilities: ReadonlyArray<Component>;
  readonly deviceCapabilities: ReadonlyArray<string>;
  readonly icon?: string;
  readonly device: {
    readonly name: string;
    readonly tokens: ReadonlyArray<string>;
    readonly icon?: string;
    readonly specificname?: string;
  };
}
