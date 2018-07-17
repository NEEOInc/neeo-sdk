import * as Debug from 'debug';
import * as Models from '../../models';

const debug = Debug('neeo:promisecache');

export default class implements Models.PromiseCache {
  private promise?: Promise<any>;
  private cacheExpire = 0;

  constructor(
    private readonly cacheDurationMs = 10000,
    private readonly uniqueIdentifier = String(Date.now())
  ) {}

  getValue(getPromiseFunction?: () => Promise<any>) {
    const {
      uniqueIdentifier,
      cacheDurationMs,
      promise: existingPromise,
      cacheExpire
    } = this;
    const now = Date.now();
    if (existingPromise && now < cacheExpire) {
      debug('use cache', uniqueIdentifier);
      return existingPromise;
    }
    if (!getPromiseFunction) {
      throw new Error('NO_CALLBACK_FUNCTION_DEFINED');
    }
    debug('requested new data', uniqueIdentifier);
    const newPromise = getPromiseFunction();
    this.promise = newPromise;
    this.cacheExpire = now + cacheDurationMs;
    return newPromise;
  }

  invalidate() {
    debug('invalidate cache');
    this.cacheExpire = 0;
  }
}
