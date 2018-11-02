export interface DeviceSetup {
  readonly discovery?: boolean;
  readonly registration?: boolean;
  readonly introheader?: string;
  readonly introtext?: string;
  readonly enableDynamicDeviceBuilder?: boolean;
}
