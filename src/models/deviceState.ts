import { PromiseCache } from './promiseCache';

export interface StateChangeCallback {
  (id: number, clientObject: object): void | PromiseLike<void>;
}

export interface DeviceState {
  /**
   * Adds a new device state to the instance.
   * @param id A unique key to identify an entry.
   * @param clientObject A object which is linked to this unique identifier.
   * @param reachable Optional parameter defines if this device is currently reachable. Defaults to true.
   * @example
   *   this.lifxClient.on('light-new', (lifx) => {
   *     debug('discovered new light', lifx.id);
   *     deviceState.addDevice(lifx.id, lifx);
   *   });
   */
  addDevice(id: number, clientObject: any, reachable?: boolean): void;

  isDeviceRegistered(id: number): boolean;

  isReachable(id: number): boolean;

  getClientObjectIfReachable(id: number): any;

  /**
   * Get all known devices by this instance.
   * @return Returns all devices (client object, id, reachable state) this instance knows..
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
   * Fetching data from a network device is expensive. The cachePromise helps by caching the device state for a certain amount of time.
   * The CachePromise wraps the expensive call - either the cached device state is returned or when the cache is empty or expired a new device state is fetched.
   * @param id a unique key to identify an entry.
   * @return A cachedPromise object, you can call the getValue function which either returns the cached state or fetches a new state.
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
   * Update the reachability state (online/offline) of a device.
   * @param id a unique key to identify an entry.
   * @param reachable this parameter defines if this device is online (true) or offline (false).
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
   * Register a callback function to be called with id and clientObject when the clientObject is changed.
   * @param callback function.
   * @example
   *   deviceState.registerStateUpdate((id, clientObject) => {
   *     console.log('state update for', id, clientObject);
   *   });
   */
  registerStateUpdate(callback: StateChangeCallback): void;
}
