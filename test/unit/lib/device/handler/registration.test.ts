'use strict';

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;
import * as sinon from 'sinon';
import * as registration from '../../../../../src/lib/device/handler/registration';

describe('./lib/device/handler/registration.ts', () => {
  describe('isRegistered', () => {
    it('should use the call back to check for existing registration', () => {
      // GIVEN
      const isRegistered = true;
      const handler = sinon.stub().resolves(isRegistered);

      // WHEN
      return registration.isRegistered(handler).then((registered) => {
        expect(handler).to.have.been.calledWith();
        expect(registered).to.deep.equal({ registered: isRegistered });
      });
    });
  });

  describe('register', () => {
    it('should use the call back to check for existing registration', () => {
      // GIVEN
      const isSuccessful = false;
      const userData = 'MySecretRegistrationCode?';
      const handler = sinon.stub().resolves(isSuccessful);

      // WHEN
      return registration.register(handler, userData).then((successful) => {
        expect(handler).to.have.been.calledWith(userData);
        expect(successful).to.deep.equal(isSuccessful);
      });
    });
  });
});
