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

BrainNotificationMapping.prototype._findNotificationKeys = function(id, componentName) {
  return new Promise((resolve, reject) => {
    const deviceDescription = this.cache.get(id);

    //first try to find by name
    const correctEntriesByName = deviceDescription.filter((entry) => {
      return entry.eventKey && entry.name === componentName;
    });
    if (correctEntriesByName.length > 0) {
      const notificationKeys = mapToNotificationKeys(correctEntriesByName);
      return resolve(notificationKeys);
    }
    // then try by label
    const correctEntriesByLabel = deviceDescription.filter((entry) => {
      return entry.eventKey && entry.label === componentName;
    });
    if (correctEntriesByLabel.length) {
      const notificationKeys = mapToNotificationKeys(correctEntriesByLabel);
      return resolve(notificationKeys);
    }

    //cache might be outdated
    this.cache.delete(id);
    reject(new Error('COMPONENTNAME_NOT_FOUND ' + componentName));
  });
};

BrainNotificationMapping.prototype.getNotificationKeys = function(uniqueDeviceId, deviceId, componentName) {
  const id = createRequestId(this.adapterName, uniqueDeviceId, deviceId);
  if (this.cache.has(id)) {
    return this._findNotificationKeys(id, componentName);
  }
  return this._fetchDataFromBrain(uniqueDeviceId, deviceId, componentName)
    .then((notificationKeys) => {
      if (!Array.isArray(notificationKeys)) {
        return BluePromise.reject(new Error('INVALID_SERVER_RESPONSE'));
      }
      this.cache.set(id, notificationKeys);
      return this._findNotificationKeys(id, componentName);
    });

};

function mapToNotificationKeys(entries) {
  return entries.map((entry) => entry.eventKey);
}
