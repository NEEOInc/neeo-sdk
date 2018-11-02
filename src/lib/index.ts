 // tslint:disable:max-line-length

import { startServer as deviceStartServer } from './device';
import expressBrainDriver from './expressBrainDriver';
import { checkNodeVersion } from './nodeCheck';

checkNodeVersion();

/**
 * @module NEEOAPI
 * @description Welcome to the **NEEO API**.
 *
 * This API allows you to interact with the NEEO Brain on different levels:
 * - **Recipe**: You can interact with existing Recipes on the NEEO Brain
 * - **Deviceadapter**: Build a custom deviceadapter (using the Devicebuilder) to support your custom device by NEEO.
 *
 * This is the main class which gets exposed when you request this module
 */

export * from './discover';
export * from './recipe';
export * from './models';
export { buildBrowseList, buildDevice, buildDeviceState, stopServer } from './device';

/**
 * Starts the internal REST server (based on Express.js) and register this adapter on the NEEO Brain - so the Brain can find this adapter
 * @deprecated Will be removed in future versions of the SDK. Please use the `neeo-sdk` CLI instead.
 * @function
 * @param {Object} configuration JSON Configuration Object
 * @param {NEEOBrain} configuration.brain NEEOBrain object
 * @param {Number} configuration.port listening port
 * @param {String} configuration.name device name
 * @param {Array} configuration.devices all associated devices for this driver
 * Optionally you can add **baseurl** to define the listening ip - handy if you have multiple IP's or running in a docker container.
 * @return {Promise} will be resolved when adapter is registered and REST server is started
 * @example
 * neeoapi.startServer({
 *   brain,
 *   port: 6336,
 *   name: 'custom-adapter',
 *   devices: [device1, device2]
 * });
 */
export function startServer(configuration) {
  return deviceStartServer(configuration, expressBrainDriver);
}
