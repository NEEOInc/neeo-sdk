'use strict';

const debug = require('debug')('neeo:device:brain:BrainDeviceSubscriptions');
const BluePromise = require('bluebird');
const axios = require('axios');

const REST_OPTIONS = { timeout: 8000 };
const RETRY_DELAY_MS = 2500;
const MAX_RETRIES = 2;

module.exports = class BrainDeviceSubscriptions {
  constructor(options) {
    debug('init %o', options);
    if (!options || !options.adapterName || !options.url) {
      throw new Error('INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER');
    }
    this.adapterName = options.adapterName;
    this.subscriptionsUri = options.url + '/v1/api/subscriptions/' +
      options.adapterName + '/';
    this.cache = new Map();
  }

  static build(options) {
    return new BrainDeviceSubscriptions(options);
  }

  getSubscriptions(deviceId) {
    debug('GET_DEVICE_SUBSCRIPTIONS %s/%s', this.adapterName, deviceId);

    return retryWithDelay(
        () => axios.get(this.subscriptionsUri + deviceId, REST_OPTIONS),
        MAX_RETRIES,
        RETRY_DELAY_MS
      ).then((response) => response.data);
  }
};

function retryWithDelay(action, retryCount, retryDelay) {
  return action()
    .catch((error) => {
      if (retryCount > 0) {
        debug('getSubscription error %s, retry in %s', error.message, retryDelay);
        return BluePromise.delay(retryDelay)
          .then(() => retryWithDelay(action, retryCount - 1, retryDelay));
      }

      debug('getSubscription failed on last retry %s', error.message);
      return BluePromise.reject(error);
    });
}
