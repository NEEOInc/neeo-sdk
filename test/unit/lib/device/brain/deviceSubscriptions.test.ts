import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as nock from 'nock';
import * as sinon from 'sinon';
import BrainDeviceSubscriptions from '../../../../../src/lib/device/brain/deviceSubscriptions';

const adapterName = 'adapter0';
const url = 'http://foo.bar';

describe('./lib/device/brain/deviceSubscriptions.ts', () => {
  const sandbox = sinon.createSandbox();
  let netMock;

  beforeEach(() => {
    netMock = null;
    nock.cleanAll();
  });

  afterEach(() => {
    if (netMock) {
      netMock.done();
    }
    sandbox.restore();
  });

  describe('constructor', () => {
    it('should fail to build without options', () => {
      expect(() => {
        // @ts-ignore
        BrainDeviceSubscriptions.build();
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });

    it('should fail to build without adapterName', () => {
      expect(() => {
        // @ts-ignore
        BrainDeviceSubscriptions.build({ url });
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });

    it('should fail to build without url', () => {
      expect(() => {
        // @ts-ignore
        BrainDeviceSubscriptions.build({ adapterName });
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });
  });

  describe('getSubscriptions()', () => {
    let deviceSubscriptions;

    beforeEach(() => {
      deviceSubscriptions = BrainDeviceSubscriptions.build({
        adapterName,
        url,
      });
      sandbox.stub(BluePromise, 'delay').returns(BluePromise.resolve());
    });

    it('should fetch subscriptions from the Brain', () => {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;
      const responseSubscribedIds = ['01', '02'];

      netMock = nock(url)
        .get(expectedURI)
        .reply(200, responseSubscribedIds);

      return deviceSubscriptions.getSubscriptions(deviceId).then((deviceIds) => {
        expect(deviceIds).to.deep.equal(responseSubscribedIds);
      });
    });

    it('should retry if first call fails', () => {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;
      const responseSubscribedIds = ['01', '02'];

      netMock = nock(url)
        .get(expectedURI)
        .reply(500)
        .get(expectedURI)
        .reply(200, responseSubscribedIds);

      return deviceSubscriptions.getSubscriptions(deviceId).then((deviceIds) => {
        expect(deviceIds).to.deep.equal(responseSubscribedIds);
        expect(BluePromise.delay).to.have.been.calledWith(2500);
      });
    });

    it('should fail after several tries', () => {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;

      netMock = nock(url)
        .get(expectedURI)
        .reply(500)
        .get(expectedURI)
        .reply(500)
        .get(expectedURI)
        .reply(500);

      return deviceSubscriptions
        .getSubscriptions(deviceId)
        .then(() => {
          throw new Error('should have failed');
        })
        .catch((error) => {
          expect(error.message).to.deep.equal('Request failed with status code 500');
          expect(BluePromise.delay).to.have.been.calledTwice;
        });
    });
  });
});
