'use strict';

const Tokensearch = require('tokensearch.js');
const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:Database');

const MAX_SEARCH_RESULTS = 10;
const SEARCH_MATCHFACTOR = 0.5;

class Database {

  constructor(adapters) {
    this.devices = [];
    this.deviceMap = new Map();
    this.initialisedDevices = new Set();
    let index = 0;

    adapters.forEach((adapter) => {
      debug('build adapter.adapterName',adapter.adapterName);
      adapter.devices.forEach((device) => {
        this.devices.push({
          id: index++,
          adapterName: adapter.adapterName,
          type: device.type || adapter.type,
          manufacturer: device.manufacturer || adapter.manufacturer,
          name: device.name,
          tokens: device.tokens ? device.tokens.join(' ') : '',
          device: device,
          setup: adapter.setup,
          timing: adapter.timing || {},
          capabilities: adapter.capabilities,
          deviceCapabilities: adapter.deviceCapabilities,
        });
      });
      this.deviceMap.set(adapter.adapterName, adapter);
    });

    this.deviceIndex = new Tokensearch(this.devices, {
      unique: true,
      delimiter: ' ',
      collectionKeys: ['manufacturer', 'name', 'type', 'tokens'],
      threshold: SEARCH_MATCHFACTOR
    });
  }

  search(_query) {
    if (!_query) {
      return [];
    }
    const query = _query.toLowerCase();
    const result = this.deviceIndex.search(query);
    return result.slice(0, MAX_SEARCH_RESULTS)
      .map(searchResult => {
        return searchResult;
      }) || [];
  }

  // return devices when searching from IUI add device
  getDevice(databaseId) {
    if (!this.devices[databaseId]) {
      throw new Error('INVALID_DEVICE_REQUESTED_' + databaseId);
    }
    debug('get device with id %s', databaseId);
    return this.devices[databaseId];
  }

  _lazyInitController(entry) {
    if (!entry || !entry.adapterName) {
      return BluePromise.resolve();
    }
    const id = entry.adapterName;
    if (this.initialisedDevices.has(id)) {
      return BluePromise.resolve();
    }
    if (!entry.initialiseFunction) {
      debug('INIT_CONTROLLER_NOT_FOUND', id);
      this.initialisedDevices.add(id);
      return BluePromise.resolve();
    }
    debug('INIT_CONTROLLER', id);
    this.initialisedDevices.add(id);
    return BluePromise.resolve(entry.initialiseFunction())
      .catch((error) => {
        debug('INIT_CONTROLLER_FAILED', error && error.message ? error.message : '');
        this.initialisedDevices.delete(id);
      });
  }

  getDeviceByAdapterId(adapterId) {
    return new BluePromise((resolve, reject) => {
      if (!this.deviceMap.has(adapterId)) {
        reject(new Error('INVALID_DEVICE_REQUESTED_' + adapterId));
      }
      const entry = this.deviceMap.get(adapterId);
      if (this.initialisedDevices.has(adapterId)) {
        resolve(entry);
      }
      this._lazyInitController(entry)
        .then(() => {
          resolve(entry);
        });
    });
  }
}

module.exports.build = function(adapters) {
  debug('build new Databased, # entries:', adapters.length);
  return new Database(adapters);
};
