import axios from 'axios';
import * as BluePromise from 'bluebird';
import * as Debug from 'debug';

const debug = Debug('neeo:device:brain:BrainDeviceSubscriptions');

const REST_OPTIONS = { timeout: 8000 };
const RETRY_DELAY_MS = 2500;
const MAX_RETRIES = 2;

export interface BrainDeviceSubscriptionOptions {
  adapterName: string;
  url: string;
}

export default class BrainDeviceSubscriptions {
  public static build(options: BrainDeviceSubscriptionOptions) {
    return new BrainDeviceSubscriptions(options);
  }
  public readonly adapterName: string;
  public readonly subscriptionsUri: string;
  public readonly cache: Map<number, any>;

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

  public getSubscriptions(deviceId: string) {
    const { adapterName, subscriptionsUri } = this;
    debug('GET_DEVICE_SUBSCRIPTIONS %s/%s', adapterName, deviceId);

    return retryWithDelay(
      () => axios.get(subscriptionsUri + deviceId, REST_OPTIONS),
      MAX_RETRIES,
      RETRY_DELAY_MS
    ).then((response) => response.data);
  }
}

function retryWithDelay<T = any>(
  action: () => Promise<T>,
  retryCount: number = MAX_RETRIES,
  retryDelay: number
): Promise<T> {
  return action().catch((error) => {
    if (retryCount > 0) {
      debug('getSubscription error %s, retry in %s', error.message, retryDelay);
      return BluePromise.delay(retryDelay).then(() =>
        retryWithDelay(action, retryCount - 1, retryDelay)
      );
    }

    debug('getSubscription failed on last retry %s', error.message);
    return BluePromise.reject(error);
  });
}
