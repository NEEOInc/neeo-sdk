import * as Debug from 'debug';
import axios from 'axios';

const debug = Debug('neeo:device:brain:BrainDeviceSubscriptions');

const REST_OPTIONS = { timeout: 8000 };
const RETRY_DELAY_MS = 2500;
const MAX_RETRIES = 2;

export interface BrainDeviceSubscriptionOptions {
  adapterName: string;
  url: string;
}

export default class BrainDeviceSubscriptions {
  readonly adapterName: string;
  readonly subscriptionsUri: string;
  readonly cache: Map<number, any>;

  constructor(options: BrainDeviceSubscriptionOptions) {
    debug('init %o', options);
    if (!options) {
      throw new Error('INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER');
    }
    const { adapterName, url } = options;
    if (!adapterName || !url) {
      throw new Error('INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER');
    }
    this.adapterName = adapterName;
    this.subscriptionsUri = `${url}/v1/api/subscriptions/${adapterName}/`;
    this.cache = new Map();
  }

  getSubscriptions(deviceId: string) {
    const { adapterName, subscriptionsUri } = this;
    debug('GET_DEVICE_SUBSCRIPTIONS %s/%s', adapterName, deviceId);
    return retryWithDelay(() => {
      return axios.get(subscriptionsUri + deviceId, REST_OPTIONS);
    }).then(({ data }) => data as any[]);
  }

  static build(options: BrainDeviceSubscriptionOptions) {
    return new BrainDeviceSubscriptions(options);
  }
}

function retryWithDelay<T = any>(
  action: () => Promise<T>,
  retryCount: number = MAX_RETRIES
): Promise<T> {
  return action().catch(error => {
    if (retryCount > 0) {
      debug(
        'getSubscription error %s, retry in %s',
        error.message,
        RETRY_DELAY_MS
      );
      return new Promise(resolve => {
        global.setTimeout(resolve, RETRY_DELAY_MS);
      }).then(() => retryWithDelay(action, retryCount - 1));
    }
    debug('getSubscription failed on last retry %s', error.message);
    return Promise.reject(error);
  });
}
