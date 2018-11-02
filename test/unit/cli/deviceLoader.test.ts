import { expect } from 'chai';
import * as deviceLoader from '../../../src/cli/deviceLoader';

describe('./cli/deviceloader.ts', () => {
  describe('loadDevices', () => {
    context('when no devices are available', () => {
      it('should not throw', () => {
        expect(deviceLoader.loadDevices()).to.not.throw;
      });
    });
  });
});
