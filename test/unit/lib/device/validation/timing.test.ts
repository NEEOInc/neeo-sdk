import { expect } from 'chai';
import { validate } from '../../../../../src/lib/device/validation/timing';
import { TimingSpecifier } from '../../../../../src/lib/models';

describe('./lib/device/validation/timing', () => {
  describe('validate', () => {
    const timingExpectations = [
      { params: undefined, label: 'undefined', throws: /INVALID_TIMING_PARAMETER/ },
      { params: {}, label: 'no timings', throws: /at least one timing property is needed/ },
      { params: { powerOnDelayMs: '12' }, label: 'non number', throws: /must be an integer/ },
      { params: { powerOnDelayMs: 1.2 }, label: 'non integer', throws: /must be an integer/ },
      { params: { powerOnDelayMs: 100000 }, label: 'too large', throws: /must be between 0 and/ },
      { params: { powerOnDelayMs: -12 }, label: 'too small', throws: /must be between 0 and/ },
      { params: { powerOnDelayMs: 50 }, label: 'powerOnDelayMs only', throws: false },
      { params: { sourceSwitchDelayMs: 50 }, label: 'sourceSwitchDelayMs only', throws: false },
      { params: { shutdownDelayMs: 50 }, label: 'shutdownDelayMs only', throws: false },
      { params: { powerOnDelayMs: 50, shutdownDelayMs: 50, sourceSwitchDelayMs: 50 }, label: 'all', throws: false },
    ];

    timingExpectations.forEach(({params, label, throws}) => {
      const verb = throws ? 'reject for' : 'validate';
      it(`should ${verb} ${label} timing`, () => {
        throws ?
          expectValidationOf(params).to.throw(throws as RegExp | string) :
          expectValidationOf(params).to.not.throw();
      });
    });
  });

  function expectValidationOf(params) {
    // Does type casting to avoid tslint/tscompile issues
    return expect(() => validate(params as TimingSpecifier));
  }
});
