'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const registration = require('../../../../../lib/device/handler/registration');

describe('./lib/device/handler/registration.js', function() {

  describe('isRegistered', function() {
    it('should use the call back to check for existing registration', function() {
      // GIVEN
      const isRegistered = true;
      const handler = sinon.stub().resolves(isRegistered);

      // WHEN
      return registration.isRegistered(handler)
        .then((registered) => {
          expect(handler).to.have.been.calledWith();
          expect(registered).to.deep.equal({ registered: isRegistered});
        });
    });
  });

  describe('register', function() {
    it('should use the call back to check for existing registration', function() {
      // GIVEN
      const isSuccessful = false;
      const userData = 'MySecretRegistrationCode?';
      const handler = sinon.stub().resolves(isSuccessful);

      // WHEN
      return registration.register(handler, userData)
        .then((successful) => {
          expect(handler).to.have.been.calledWith(userData);
          expect(successful).to.deep.equal(isSuccessful);
        });
    });
  });
});
