'use strict';

const Tokensearch = require('tokensearch.js');
const debug = require('debug')('neeo:device:Database');

const MAX_SEARCH_RESULTS = 10;
const SEARCH_MATCHFACTOR = 0.5;

const adapters = [];

module.exports.register = function(device) {
  adapters.push(device);
};

const Database = class Database {

  constructor() {
    this.devices = [];
    let index = 0;

    adapters.forEach((adapter) => {
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
          capabilities: adapter.capabilities
        });
      });
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

  getDevice(id) {
    if (!this.devices[id]) {
      throw new Error('INVALID_DEVICE_REQUESTED_' + id);
    }
    debug('get device with id %s', id);
    return this.devices[id];
  }

};

module.exports.build = function() {
  return new Database();
};
