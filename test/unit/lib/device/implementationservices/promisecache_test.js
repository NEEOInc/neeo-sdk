'use strict';

const expect = require('chai').expect;
const PromiseCache = require('../../../../../lib/device/implementationservices/promisecache');
const sinon = require('sinon');

describe('./lib/device/implementationservices/promisecache.js', function() {

  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  function delayPromise(durationMs) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, durationMs);
		});
  }

  it('should callback only once', function() {
    const cache = new PromiseCache();
    let callbackcount = 0;

    const callback = function() {
      callbackcount++;
      return Promise.resolve();
    };
    for (let i=0; i<8; i++) {
      cache.getValue(callback);
    }
    expect(callbackcount).to.equal(1);
  });

  it('should invalidate cache', function() {
    const cache = new PromiseCache();
    let callbackcount = 0;

    const callback = function() {
      callbackcount++;
      return Promise.resolve();
    };
    for (let i=0; i<8; i++) {
      cache.getValue(callback);
    }
    const cacheExpireOld = cache.cacheExpire;
    cache.invalidate();
    expect(cache.cacheExpire).to.equal(0);
    expect(cacheExpireOld > 0).to.equal(true);
    expect(callbackcount).to.equal(1);
  });

  it('invalid function parameter', function () {
    const cache = new PromiseCache();
    expect(() => {
      cache.getValue();
    }).to.throw(/NO_CALLBACK_FUNCTION_DEFINED/);
  });

  it('should not execute callback mutliple times (NEST issue)', function() {
    //GIVEN
    const cache = new PromiseCache();
    let runCount = 0;

    function slowFunction() {
      return delayPromise(300)
        .then(() => {
          runCount++;
        });
    }

    //WHEN
    for (let i=0; i<8; i++) {
      cache.getValue(slowFunction);
      clock.tick(1000);
    }

    //THEN
    return cache.getValue(slowFunction)
      .then(() => {
        expect(runCount).to.equal(1);
      });
  });

});
