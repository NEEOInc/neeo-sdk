'use strict';

import { expect } from 'chai';
import * as inputchecker from '../../../../../src/lib/device/validation/inputMacroChecker';

describe('./lib/device/validation/inputMacroChecker.ts', () => {
  it('should throw error when parameter is not of type Array', () => {
    // @ts-ignore
    expect(() => inputchecker.hasNoInputButtonsDefined('foo')).to.throw(/NOT_ARRAY_PARAMETER/);
  });

  it('empty array returns missing input buttons', () => {
    const result = inputchecker.hasNoInputButtonsDefined([]);
    expect(result).to.equal(true);
  });

  it('random strings returns missing input buttons', () => {
    const result = inputchecker.hasNoInputButtonsDefined([
      { param: { name: 'FOO' } },
      { param: { name: 'INTHEBAR' } },
    ]);
    expect(result).to.equal(true);
  });

  it('should find input command', () => {
    const result = inputchecker.hasNoInputButtonsDefined([
      { param: { name: 'FOO' } },
      { param: { name: 'INPUT HDMI 1' } },
    ]);
    expect(result).to.equal(false);
  });

  it('should not ignore empty parameter', () => {
    // @ts-ignore
    const result = inputchecker.hasNoInputButtonsDefined([
      { param: {} },
      { foo: { bar: 'INPUT HDMI 1' } },
    ]);
    expect(result).to.equal(true);
  });
});
