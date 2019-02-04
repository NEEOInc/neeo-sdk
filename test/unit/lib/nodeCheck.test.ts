'use strict';

import { expect } from 'chai';
import { checkNodeVersion } from '../../../src/lib/nodeCheck';

describe('./lib/nodecheck.ts', () => {
  it('should not throw any error when node version is >= 6.0', () => {
    expect(checkNodeVersion('6.0.1')).not.to.throw;
  });

  it('should not throw any error when node version is >= 10.0', () => {
    expect(checkNodeVersion('10.0.0')).not.to.throw;
  });

  it('should throw an error when node version is < 6.0', () => {
    expect(() => {
      checkNodeVersion('5.9');
    }).to.throw('You must run the NEEO SDK on node >= 6.0. Your current node version is 5.9');
  });
});
