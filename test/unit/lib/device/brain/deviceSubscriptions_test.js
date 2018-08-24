'use strict';

const sinon = require('sinon');
const BluePromise = require('bluebird');
const expect = require('chai').expect;
const BrainDeviceSubscriptions = require('../../../../../lib/device/brain/deviceSubscriptions.js');
const nock = require('nock');

const adapterName = 'adapter0';
const url = 'http://foo.bar';

describe('./lib/device/brain/deviceSubscriptions.js', function() {
  const sandbox = sinon.createSandbox();
  let netMock;

  beforeEach(function() {
    netMock = null;
    nock.cleanAll();
  });

  afterEach(function() {
    if (netMock) {
      netMock.done();
    }
    sandbox.restore();
  });

  describe('constructor', function() {
    it('should fail to build without options', function() {
      expect(() => {
        BrainDeviceSubscriptions.build();
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });


    it('should fail to build without adapterName', function() {
      expect(() => {
        BrainDeviceSubscriptions.build({ url });
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });


    it('should fail to build without url', function() {
      expect(() => {
        BrainDeviceSubscriptions.build({ adapterName });
      }).to.throw(/INVALID_DEVICE_SUBSCRIPTIONS_PARAMETER/);
    });
  });

  describe('getSubscriptions()', function() {
    let deviceSubscriptions;

    beforeEach(function() {
      deviceSubscriptions = BrainDeviceSubscriptions.build({ adapterName, url });
      sandbox.stub(BluePromise, 'delay').returns(BluePromise.resolve());
    });

    it('should fetch subscriptions from the Brain', function() {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;
      const responseSubscribedIds = ['01', '02'];

      netMock = nock(url)
        .get(expectedURI).reply(200, responseSubscribedIds);

      return deviceSubscriptions.getSubscriptions(deviceId)
        .then((deviceIds) => {
          expect(deviceIds).to.deep.equal(responseSubscribedIds);
        });
    });

    it('should retry if first call fails', function() {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;
      const responseSubscribedIds = ['01', '02'];

      netMock = nock(url)
        .get(expectedURI).reply(500)
        .get(expectedURI).reply(200, responseSubscribedIds);

      return deviceSubscriptions.getSubscriptions(deviceId)
        .then((deviceIds) => {
          expect(deviceIds).to.deep.equal(responseSubscribedIds);
          expect(BluePromise.delay).to.have.been.calledWith(2500);
        });
    });

    it('should fail after several tries', function() {
      const deviceId = 'affeaffeaffe';
      const expectedURI = `/v1/api/subscriptions/${adapterName}/${deviceId}`;

      netMock = nock(url)
        .get(expectedURI).reply(500)
        .get(expectedURI).reply(500)
        .get(expectedURI).reply(500);

      return deviceSubscriptions.getSubscriptions(deviceId)
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
