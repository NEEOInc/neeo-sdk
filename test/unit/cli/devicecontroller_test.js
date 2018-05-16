'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const deviceLoader = require('../../../cli/deviceloader');
const { startDevices, stopDevices } = require('../../../cli/devicecontroller');
const DeviceBuilder = require('../../../lib/device/devicebuilder');
const sdk = require('../../../lib');

describe('./cli/devicecontroller.js', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(sdk);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('stopDevices', function() {
    context('when no server configuration has been stored', function() {
      it('should not stop the server', function() {
        stopDevices();

        expect(sdk.stopServer).to.not.have.been.called;
      });
    });

    context('when the server configuration has been stored', function() {
      it('should stop the server', function() {
        sandbox
          .stub(deviceLoader, 'loadDevices')
          .returns([buildSampleDevice()]);

        return startDevices({ brainHost: '10.0.0.1' }).then(() => {
          stopDevices();
          expect(sdk.stopServer).to.have.been.called;
        });
      });
    });
  });

  describe('startDevices', function() {
    context('when no devices are found', function() {
      it('should throw an error', function() {
        sandbox.stub(deviceLoader, 'loadDevices').returns([]);

        expect(startDevices).to.throw('No devices found!');
      });
    });

    context('when brain host is configured', function() {
      it('should start the server on given brain host', function() {
        const sdkOptions = {
          brainHost: '10.0.0.1',
        };

        const device = buildSampleDevice();
        sandbox.stub(deviceLoader, 'loadDevices').returns([device]);

        return startDevices(sdkOptions).then(() => {
          expect(sdk.startServer).to.have.been.calledWith({
            brain: {
              host: '10.0.0.1',
              port: 3000,
            },
            port: 6336,
            name: 'default',
            devices: [device],
          });
        });
      });
      context('when brain host is not configured', function() {
        it('should start the server against the first discovered brain', function() {
          sdk.discoverOneBrain.resolves({ host: '10.0.0.2', port: 3001 });

          const device = buildSampleDevice();
          sandbox.stub(deviceLoader, 'loadDevices').returns([device]);

          return startDevices({}).then(() => {
            expect(sdk.startServer).to.have.been.calledWith({
              brain: {
                host: '10.0.0.2',
                port: 3001,
              },
              port: 6336,
              name: 'default',
              devices: [device],
            });
          });
        });
      });
    });
  });

  function buildSampleDevice() {
    return new DeviceBuilder('example-adapter', 'XXX')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function() {})
      .build('foo');
  }
});
