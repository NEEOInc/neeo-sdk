import { BrainModel } from './brainModel';

/**
 * @ignore
 * A configuration object containing properties to stop the REST server for hosting devices.
 */
export interface StopServerConfig {
  name: string;
  brain: string | BrainModel;
  baseurl?: string;
}
