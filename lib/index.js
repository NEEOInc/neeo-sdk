'use strict';

const discover = require('./discover');
const recipes = require('./recipe');
const device = require('./device');
const expressBrainDriver = require('./expressBrainDriver');
const nodecheck = require('./nodecheck');

nodecheck.checkNodeVersion();

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

/**
 * Returns a promise to the first NEEO Brain discovered on the local network.
 * @function
 * @see {@link NEEOBrain}
 * @return {promise} promise contains the found NEEOBrain.
 */
module.exports.discoverOneBrain = discover.discoverOneBrain;

/**
 * Get all existing recipes of a NEEO Brain
 * @function
 * @see {@link Recipe}
 * @param {Object|String} NEEOBrain to connect or an IP/hostname to connect
 * @return {promise} promise contains an array of all recipes of the selected NEEO Brain.
 */
module.exports.getRecipes = recipes.getAllRecipes;

/**
 * Get all powered on recipes of a NEEO Brain
 * @function
 * @param {Object|String} NEEOBrain to connect or an IP/hostname to connect
 * @return {Promise} promise contains an array with powerKey's of the powered on recipes.
 * @example
 * neeoapi.getRecipesPowerState(brain)
 * .then((poweredOnKeys) => {
 *   console.log('- Power state fetched, powered on recipes:', poweredOnKeys);
 * })
 */
module.exports.getRecipesPowerState = recipes.getRecipePowerState;

/**
 * Create new device factory, builds a searchable device for the NEEO Brain
 * @function
 * @see {@link DeviceBuilder}
 * @param {String} DeviceName The device name
 * @return {DeviceBuilder} factory methods to build device
 * @example
 *  neeoapi.buildDevice('simpleDevice1')
 *    .setManufacturer('NEEO')
 *    .addAdditionalSearchToken('foo')
 *    .setType('light')
 *    .addButton({ name: 'example-button', label: 'my button' }, controller.button)
 *    .addSwitch({ name: 'example-switch', label: 'my switch' },
 *      { setter: controller.switchSet, getter: controller.switchGet })
 *    .addSlider({ name: 'example-slider', label: 'my slider', range: [0,110], unit: '%' },
 *      { setter: controller.sliderSet, getter: controller.sliderGet });
 */
module.exports.buildDevice = device.buildCustomDevice;

/**
 * This function builds a new DeviceState Object which helps organise client states, cache states and reachability
 * @function
 * @see {@link DeviceState}
 * @param {integer} cacheTimeMs how long should a devicestate be cached (optional, default is 2000ms)
 * @return {DeviceState} a new DeviceState instance
 * @example
 *  const deviceState = neeoapi.buildDeviceState(2000);
 */
module.exports.buildDeviceState = device.buildDeviceState;

/**
 * Starts the internal REST server (based on Express.js) and register this adapter on the NEEO Brain - so the Brain can find this adapter
 * @function
 * @param {Object} configuration - Configuration Object with **brain** (NEEOBrain object), **port** (listening port), device **name** and all associated **devices**.
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
module.exports.startServer = (configuration) => {
  return device.startServer(configuration, expressBrainDriver);
};

/**
 * Stops the internal REST server and unregister this adapter on the NEEO Brain
 * @function
 * @param {Object} JSON Object with **brain** Object and **adapter name**
 * @return {Promise} will be resolved when adapter is unregistered and REST server is stopped
 * @example
 * neeoapi.stopServer({ brain: brain, name: 'custom-adapter' });
 */
module.exports.stopServer = device.stopServer;
