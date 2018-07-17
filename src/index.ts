import checkNodeVersion from './nodeCheck';

checkNodeVersion();

import { StartServerConfig } from './models';
import expressBrainDriver from './expressBrainDriver';
import {
  startServer as startDeviceServer,
  stopServer,
  buildCustomDevice as buildDevice,
  buildDeviceState,
  buildBrowseList
} from './device';

/**
 * Starts the internal REST server (based on Express.js) and register this adapter on the NEEO Brain - so the Brain can find this adapter
 * @function
 * @param configuration - Configuration Object with **brain** (NEEOBrain object or host string), **port** (listening port), device **name** and all associated **devices**.
 * Optionally you can add **baseurl** to define the listening ip - handy if you have multiple IP's or running in a docker container.
 * @return Promise that will be resolved when adapter is registered and REST server is started.
 * @example neeoapi.startServer({
 *   brain,
 *   port: 6336,
 *   name: 'custom-adapter',
 *   devices: [device1, device2]
 * });
 */
export function startServer(configuration: StartServerConfig) {
  return startDeviceServer(configuration, expressBrainDriver);
}

export { buildDeviceState, buildDevice, stopServer, buildBrowseList };
export {
  getAllRecipes as getRecipes,
  getRecipePowerState as getRecipesPowerState
} from './recipe';
export { discoverOneBrain } from './discover';
export * from './models';
