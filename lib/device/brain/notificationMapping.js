'use strict';

const debug = require('debug')('neeo:device:brain:BrainNotificationMapping');
const axios = require('axios');
const BluePromise = require('bluebird');

const REST_OPTIONS = { timeout: 8000 };

const BrainNotificationMapping = module.exports = function(options) {
  debug('init %o', options);
  if (!options || !options.adapterName || !options.url) {
    throw new Error('INVALID_NOTIFICATIONMAPPING_PARAMETER');
  }
  this.adapterName = options.adapterName;
  this.brainUri = options.url + '/v1/api/notificationkey/' + options.adapterName;
  this.cache = new Map();
};

function createRequestId(adapterName, uniqueDeviceId, deviceId) {
  return `${uniqueDeviceId}-${deviceId}-${adapterName}`;
}

BrainNotificationMapping.prototype._fetchDataFromBrain = function(uniqueDeviceId, deviceId, componentName) {
  debug('getNotificationKey', componentName, uniqueDeviceId, this.adapterName, deviceId);
  const url = `${this.brainUri}/${deviceId}/${uniqueDeviceId}`;
  debug('GET request url', url);
  return axios.get(url, REST_OPTIONS)
    .then((response) => {
      return response.data;
    });
};

BrainNotificationMapping.prototype._findNotificationKey = function(id, componentName) {
  return new Promise((resolve, reject) => {
    const deviceDescription = this.cache.get(id);
    //first try to find by name
    const correctEntryByName = deviceDescription.find((entry) => {
      return entry.name === componentName;
    });
    if (correctEntryByName && correctEntryByName.eventKey) {
      return resolve(correctEntryByName.eventKey);
    }

    // then try by label
    const correctEntryByLabel = deviceDescription.find((entry) => {
      return entry.label === componentName;
    });
    if (correctEntryByLabel && correctEntryByLabel.eventKey) {
      return resolve(correctEntryByLabel.eventKey);
    }

    //cache might be outdated
    this.cache.delete(id);
    reject(new Error('COMPONENTNAME_NOT_FOUND ' + componentName));
  });
};

BrainNotificationMapping.prototype.getNotificationKey = function(uniqueDeviceId, deviceId, componentName) {
  const id = createRequestId(this.adapterName, uniqueDeviceId, deviceId);
  if (this.cache.has(id)) {
    return this._findNotificationKey(id, componentName);
  }
  return this._fetchDataFromBrain(uniqueDeviceId, deviceId, componentName)
    .then((result) => {
      if (!Array.isArray(result)) {
        return BluePromise.reject(new Error('INVALID_SERVER_RESPONSE'));
      }
      this.cache.set(id, result);
      return this._findNotificationKey(id, componentName);
    });

};
