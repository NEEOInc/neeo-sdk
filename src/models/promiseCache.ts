/**
 * An interface for an object that caches a promise.
 */
export interface PromiseCache {
  /**
   * Invalidate the cache.
   * @example
   * promiseCache.invalidate();
   */
  invalidate(): void;
  /**
   * Get the promise from the cache.
   * @example
   * const promise = promiseCache.getValue();
   * promise.then(value => console.log(value);
   */
  getValue(): Promise<any>;
  /**
   * Get the promise from the cache (optionally providing a cache filling method that will be used if the cache does not already have a promise or the cached promise is expired).
   * @param getPromiseFunction An optional cache filling function that will be used if the cache is expired or never had a promise to begin with.
   * @example
   * const promise = promiseCache.getValue(() => fetch(url));
   * promise.then(value => console.log(value);
   */
  getValue(getPromiseFunction?: () => Promise<any>): Promise<any>;
}
