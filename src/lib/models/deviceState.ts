import { PromiseCache } from './promiseCache';

export type StateChangeCallback = (id: number, clientObject: object) => void | PromiseLike<void>;

/**
 * @module DeviceState
 * @description This Object helps organise device states, can cache device states and knows the device reachability (online/offline).
 */

/** */
export interface DeviceState {
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
  addDevice(id: number, clientObject: any, reachable?: boolean): void;

  isDeviceRegistered(id: number): boolean;

  isReachable(id: number): boolean;

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
  getClientObjectIfReachable(id: number): any;

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
  getAllDevices(): ReadonlyArray<{
    readonly id: number;
    readonly clientObject: any;
    readonly reachable: boolean;
    readonly promiseCache: PromiseCache;
  }>;

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
  getCachePromise(id: number): PromiseCache | Promise<never>;

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
  updateReachable(id: number, reachable: boolean): void;

  /**
   * @function registerStateUpdate
   * @description register callback function, that will be called with parameter id, clientObject when clientObject changed
   * @param {function} callback function
   * @example
   *   deviceState.registerStateUpdate((id, clientObject) => {
   *     console.log('state update for', id, clientObject);
   *   });
   */
  registerStateUpdate(callback: StateChangeCallback): void;
}
