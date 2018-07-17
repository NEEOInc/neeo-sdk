import { BrainModel } from './brainModel';
import { DeviceBuilder } from './deviceBuilder';

/**
 * A configuration object containing properties to start the REST server for hosting devices.
 */
export interface StartServerConfig {
  /**
   * The listening port to host the internal REST server.
   */
  port: number;
  /**
   * A string indicating the host of the brain, or a model object representing the NEEO brain.
   */
  brain: BrainModel | string;
  /**
   * Optional port number when brain is of type string.
   */
  brainport?: number;
  /**
   * Name to register on the brain with.
   */
  name: string;
  /**
   * Array of device adapters to host.
   */
  devices: ReadonlyArray<DeviceBuilder>;
  /**
   * Optionally, specify a maximum number of connection attempts to reach the NEEO brain.
   */
  maxConnectionAttempts?: number;
  /**
   * Optionally, this can be used to define the listening IP
   * (which is handy if you have multiple IPs or are running in a docker container).
   */
  baseurl?: string;
}
