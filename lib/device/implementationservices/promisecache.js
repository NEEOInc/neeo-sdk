'use strict';

const debug = require('debug')('neeo:promisecache');

const PromiseCache = module.exports = function(cacheDurationMs, uniqueIdentifier) {
  this.getPromiseFunction = null;
  this.cacheDurationMs = cacheDurationMs || 10 * 1000;
  this.cacheExpire = 0;
  this.uniqueIdentifier = uniqueIdentifier || Date.now();
};

PromiseCache.prototype.getValue = function(getPromiseFunction) {
  const now = Date.now();
  if (this.getPromiseFunction && now < this.cacheExpire) {
    debug('use cache', this.uniqueIdentifier);
    return this.getPromiseFunction;
  }

  if (getPromiseFunction) {
    debug('requested new data', this.uniqueIdentifier);
    this.getPromiseFunction = getPromiseFunction();
    this.cacheExpire = now + this.cacheDurationMs;
    return this.getPromiseFunction;
  }

  throw new Error('NO_CALLBACK_FUNCTION_DEFINED');
};

PromiseCache.prototype.invalidate = function() {
  debug('invalidate cache');
  this.cacheExpire = 0;
};

module.exports.buildInstance = function(cacheDurationMs, uniqueIdentifier) {
  return new PromiseCache(cacheDurationMs, uniqueIdentifier);
};
