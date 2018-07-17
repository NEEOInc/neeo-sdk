import PromiseCache from './promiseCache';
import * as Models from '../../models';

interface DeviceEntry {
  clientObject: object;
  promiseCache: Models.PromiseCache;
  reachable: boolean;
}

export default class implements Models.DeviceState {
  private readonly deviceMap: Map<number, DeviceEntry>;
  private stateChangeCallback?: Models.StateChangeCallback;

  constructor(private readonly cacheTimeMs = 2000) {
    this.deviceMap = new Map();
  }

  addDevice(id: number, clientObject: object, reachable = true) {
    const { cacheTimeMs, deviceMap, stateChangeCallback } = this;
    deviceMap.set(id, {
      clientObject,
      promiseCache: new PromiseCache(cacheTimeMs, `NPC-${id}`),
      reachable
    });
    if (stateChangeCallback) {
      stateChangeCallback(id, clientObject);
    }
  }

  registerStateUpdate(callback: Models.StateChangeCallback) {
    if (typeof callback !== 'function') {
      throw new Error('STATEUPDATE_CALLBACK_IS_NOT_A_FUNCTION');
    }
    if (this.stateChangeCallback) {
      throw new Error('STATEUPDATE_ONLY_ONE_CALLBACK_ALLOWED');
    }
    this.stateChangeCallback = callback;
  }

  getAllDevices() {
    const { deviceMap } = this;
    return Array.from(deviceMap.entries()).map(([id, entry]) => {
      return { id, ...entry };
    });
  }

  isDeviceRegistered(id: number) {
    return this.deviceMap.has(id);
  }

  isReachable(id: number) {
    const entry = this.deviceMap.get(id);
    return !!entry && entry.reachable;
  }

  getClientObjectIfReachable(id: number) {
    const entry = this.deviceMap.get(id);
    return entry && entry.reachable ? entry.clientObject : undefined;
  }

  getCachePromise(id: number) {
    const entry = this.deviceMap.get(id);
    return entry ? entry.promiseCache : Promise.reject(new Error('INVALID_ID'));
  }

  updateReachable(id: number, reachable: boolean) {
    const entry = this.deviceMap.get(id);
    if (entry && typeof reachable === 'boolean') {
      entry.reachable = reachable;
    }
  }
}
