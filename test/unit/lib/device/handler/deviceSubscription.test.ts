'use strict';

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;
import * as sinon from 'sinon';
import * as deviceSubscriptions from '../../../../../src/lib/device/handler/deviceSubscriptions';

describe('./lib/device/handler/deviceSubscriptions.ts', () => {
  describe('deviceAdded', () => {
    it('should use the handler to forward deviceId', () => {
      const deviceId = '42';
      const handler = sinon.stub().resolves();

      return deviceSubscriptions.deviceAdded(handler, deviceId).then((response) => {
        expect(handler).to.have.been.calledWith(deviceId);
        expect(response.success).to.equal(true);
      });
    });
  });

  describe('deviceRemoved', () => {
    it('should use the handler to forward deviceId', () => {
      const deviceId = '42';
      const handler = sinon.stub().resolves();

      return deviceSubscriptions.deviceRemoved(handler, deviceId).then((response) => {
        expect(handler).to.have.been.calledWith(deviceId);
        expect(response.success).to.equal(true);
      });
    });
  });
});
