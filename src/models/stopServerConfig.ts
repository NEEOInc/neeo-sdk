import { BrainModel } from './brainModel';

/**
 * A configuration object containing properties to stop the REST server for hosting devices.
 */
export interface StopServerConfig {
  /**
   * Name registered on the brain.
   */
  name: string;
  /**
   * A string indicating the host of the brain, or a model object representing the NEEO brain.
   */
  brain: string | BrainModel;
  /**
   * Optionally, this can be used to define the listening IP
   * (which is handy if you have multiple IPs or are running in a docker container).
   */
  baseurl?: string;
}
