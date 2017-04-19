'use strict';

const discover = require('./discover');
const recipes = require('./recipe');
const device = require('./device');

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
 * ["6224143924051574784", "6225238156560564224"]
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
 * Starts the internal REST server (based on Express.js) and register this adapter on the NEEO Brain - so the Brain can find this adapter
 * @function
 * @param {Object} conf - Configuration Object with **brain** (NEEOBrain object), **port** (listening port), device **name** and all associated **devices**.
 * @return {Promise} will be resolved when adapter is registered and REST server is started
 * @example
 * neeoapi.startServer({
 *   brain,
 *   port: 6336,
 *   name: 'custom-adapter',
 *   devices: [device1, device2]
 * });
 */
module.exports.startServer = device.startServer;

/**
 * Stops the internal REST server and unregister this adapter on the NEEO Brain
 * @function
 * @param {Object} JSON Object with **brain** Object and **adapter name**
 * @return {Promise} will be resolved when adapter is unregistered and REST server is stopped
 * @example
 * neeoapi.stopServer({ brain: brain, name: 'custom-adapter' });
 */
module.exports.stopServer = device.stopServer;
