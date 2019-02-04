'use strict';

import { expect } from 'chai';
import * as capability from '../../../../../src/lib/device/validation/capability';

describe('./lib/device/validation/capability.ts', () => {
  it('should get alwaysOn capability', () => {
    const result = capability.getCapability('alwaysOn');
    expect(result).to.equal('alwaysOn');
  });

  it('should get bridgeDevice capability', () => {
    const result = capability.getCapability('bridgeDevice');
    expect(result).to.equal('bridgeDevice');
  });

  it('should fail to get a undefined capability', () => {
    expect(() =>
      // @ts-ignore
      capability.getCapability()
    ).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (array)', () => {
    expect(() =>
      // @ts-ignore
      capability.getCapability([])
    ).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (object)', () => {
    expect(() =>
      // @ts-ignore
      capability.getCapability({})
    ).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (number)', () => {
    expect(() =>
      // @ts-ignore
      capability.getCapability(4343)
    ).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (string)', () => {
    // @ts-ignore
    expect(() => capability.getCapability('foo'))
      .to.throw(/INVALID_CAPABILITY/);
  });
});
