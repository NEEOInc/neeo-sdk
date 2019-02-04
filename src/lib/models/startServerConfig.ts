import { BrainModel } from './brainModel';
import { DeviceBuilder } from './deviceBuilder';

/**
 * @ignore
 * A configuration object containing properties to start the REST server for hosting devices.
 */
export interface StartServerConfig {
  port: number;
  brain: BrainModel | string;
  brainport?: number;
  name: string;
  devices: ReadonlyArray<DeviceBuilder>;
  maxConnectionAttempts?: number;
  baseurl?: string;
}
