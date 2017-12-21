'use strict';

const PromiseCache = require('./promisecache');
const BluePromise = require('bluebird');

/**
 * @module DeviceState
 * @description This Object helps organise device states, can cache device states and knows the device reachability (online/offline).
 */

/** */ // avoid doxdox thinking the @module above is for this function.
class DeviceState {

  constructor(cacheTimeMs = 2000) {
    this.cacheTimeMs = cacheTimeMs;
    this.deviceMap = new Map();
  }

  /**
   * @function addDevice
   * @description Adds a new device state to the instance.
   * @param {integer} id a unique key to identify an entry
   * @param {object} clientobject any object which is linked to this unique identifier.
   * @param {boolean} reachable this optional parameter defines if this device is currently reachable. Defaults to true.
   * @example
   *   this.lifxClient.on('light-new', (lifx) => {
   *     debug('discovered new light', lifx.id);
   *     deviceState.addDevice(lifx.id, lifx);
   *   });
   */
  addDevice(id, clientObject, reachable = true) {
    const deviceEntry = {
      clientObject,
      promiseCache: PromiseCache.buildInstance(this.cacheTimeMs, 'NPC-'+id),
      reachable,
    };
    this.deviceMap.set(id, deviceEntry);
  }

 /**
  * @function getAllDevices
  * @return {Array} Returns all devices (client object, id, reachable state) this instance knows..
  * @example
  *   function discoverDevices() {
  *     const allDevices = deviceState.getAllDevices();
  *     return allDevices
  *       .map((deviceEntry) => {
  *         return {
  *           id: deviceEntry.id,
  *           name: deviceEntry.clientObject.label,
  *           reachable: deviceEntry.reachable
  *         };
  *       });
  *   };
  */
  getAllDevices() {
    const deviceIds = Array.from( this.deviceMap.keys() );
    return deviceIds
      .map((id) => {
        const entry = this.deviceMap.get(id);
        entry.id = id;
        return entry;
      });
  }

  isDeviceRegistered(id) {
    return this.deviceMap.has(id);
  }

  isReachable(id) {
    const deviceEntry = this.deviceMap.get(id);
    if (!deviceEntry) {
      return false;
    }
    return deviceEntry.reachable;
  }

  /**
   * @function getClientObjectIfReachable
   * @description Gets the device state when the device is reachable. Used if you want to interact with the device state.
   * @param {integer} id a unique key to identify an entry.
   * @return {Object} The stored device state if the device is reachable OR undefined when device is NOT reachable.
   * @example
   *   const light = deviceState.getClientObjectIfReachable(deviceId);
   *   if (!light) {
   *     return BluePromise.reject(new Error('NOT_REACHABLE'));
   *   }
   *   return light.turnOn();
   */
  getClientObjectIfReachable(id) {
    const deviceEntry = this.deviceMap.get(id);
    if (!deviceEntry || deviceEntry.reachable !== true) {
      return;
    }
    return deviceEntry.clientObject;
  }

  /**
   * @function getCachePromise
   * @description Fetching data from a network device is expensive. The cachePromise helps by caching the device state for a certain amount of time. The CachePromise wraps the expensive call - either the cached device state is returned or when the cache is empty or expired a new device state is fetched.
   * @param {integer} id a unique key to identify an entry.
   * @return {Object} A cachedPromise object, you can call the getValue function which either returns the cached state or fetches a new state.
   * @example
   *     getState(deviceId) {
   *       const light = this.deviceState.getClientObjectIfReachable(deviceId);
   *
   *       function getLampState() {
   *         return new BluePromise((resolve, reject) => {
   *           light.getState((err, state) => {
   *             if (err) {
   *               reject(err);
   *             }
   *             resolve(state);
   *           });
   *         });
   *       }
   *
   *       return deviceState
   *         .getCachePromise(deviceId)
   *         .getValue(getLampState);
   *     }
   */
  getCachePromise(id) {
    const deviceEntry = this.deviceMap.get(id);
    if (!deviceEntry) {
      return BluePromise.reject(new Error('INVALID_ID'));
    }
    return deviceEntry.promiseCache;
  }

  /**
   * @function updateReachable
   * @description Update the reachability state (online/offline) of a device.
   * @param {integer} id a unique key to identify an entry.
   * @param {boolean} reachable this parameter defines if this device is online (true) or offline (false).
   * @example
   *   this.lifxClient.on('light-online', (lifx) => {
   *     debug('light-online', lifx.id);
   *     deviceState.updateReachable(lifx.id, true);
   *   });
   *   this.lifxClient.on('light-offline', (lifx) => {
   *     debug('light-offline', lifx.id);
   *     deviceState.updateReachable(lifx.id, false);
   *   });
   */
  updateReachable(id, reachable) {
    const deviceEntry = this.deviceMap.get(id);
    const isBoolean = reachable === true || reachable === false;
    if (!deviceEntry || !isBoolean) {
      return;
    }
    deviceEntry.reachable = reachable;
  }

}

/**
 * @function buildInstance
 * @description Builds a new instance of the DeviceState.
 * @param {integer} cacheTimeMs how long should a devicestate be cached, optional parameter, default is 2000ms.
 * @return {DeviceBuilder} DeviceState object.
 */
function buildInstance(cacheTimeMs) {
  return new DeviceState(cacheTimeMs);
}

module.exports = {
  buildInstance
};
