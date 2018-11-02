import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as sinon from 'sinon';
import PromiseCache from '../../../../../src/lib/device/implementationservices/promiseCache';

describe('./lib/device/implementationservices/promisecache.ts', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  function delayPromise(durationMs) {
    return new BluePromise((resolve) => {
      setTimeout(() => {
        resolve();
      }, durationMs);
    });
  }

  it('should callback only once', () => {
    const cache = new PromiseCache();
    let callbackcount = 0;

    const callback = () => {
      callbackcount++;
      return BluePromise.resolve();
    };
    for (let i = 0; i < 8; i++) {
      cache.getValue(callback);
    }
    expect(callbackcount).to.equal(1);
  });

  it('should invalidate cache', () => {
    const cache = new PromiseCache();
    let callbackcount = 0;

    const callback = () => {
      callbackcount++;
      return BluePromise.resolve();
    };
    for (let i = 0; i < 8; i++) {
      cache.getValue(callback);
    }
    cache.invalidate();
    expect(callbackcount).to.equal(1);
  });

  it('invalid function parameter', () => {
    const cache = new PromiseCache();
    expect(() => {
      cache.getValue();
    }).to.throw(/NO_CALLBACK_FUNCTION_DEFINED/);
  });

  it('should not execute callback mutliple times (NEST issue)', () => {
    // GIVEN
    const cache = new PromiseCache();
    let runCount = 0;

    function slow() {
      return delayPromise(300).then(() => {
        runCount++;
      });
    }

    // WHEN
    for (let i = 0; i < 8; i++) {
      cache.getValue(slow);
      clock.tick(1000);
    }

    // THEN
    return cache.getValue(slow).then(() => {
      expect(runCount).to.equal(1);
    });
  });
});
