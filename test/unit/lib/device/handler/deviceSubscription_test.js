'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const deviceSubscriptions = require('../../../../../lib/device/handler/deviceSubscriptions');

describe('./lib/device/handler/deviceSubscriptions.js', function() {

  describe('deviceAdded', function() {
    it('should use the handler to forward deviceId', function() {
      // GIVEN
      const deviceId = '42';
      const handler = sinon.stub().resolves();

      // WHEN
      return deviceSubscriptions.deviceAdded(handler, deviceId)
        .then((response) => {
          expect(handler).to.have.been.calledWith(deviceId);
          expect(response.success).to.equal(true);
        });
    });
  });

  describe('deviceRemoved', function() {
    it('should use the handler to forward deviceId', function() {
      // GIVEN
      const deviceId = '42';
      const handler = sinon.stub().resolves();

      // WHEN
      return deviceSubscriptions.deviceRemoved(handler, deviceId)
        .then((response) => {
          expect(handler).to.have.been.calledWith(deviceId);
          expect(response.success).to.equal(true);
        });
    });
  });
});
