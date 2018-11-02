import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { startDevices, stopDevices } from '../../../src/cli/deviceController';
import * as deviceLoader from '../../../src/cli/deviceLoader';
import * as sdk from '../../../src/lib';
import { DeviceBuilder } from '../../../src/lib/device/deviceBuilder';

const expect = chai.expect;

chai.use(sinonChai);

describe('./cli/deviceController.ts', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(sdk).stopServer.resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('stopDevices', () => {
    context('when no server configuration has been stored', () => {
      it('should not stop the server', () => {
        stopDevices();

        expect(sdk.stopServer).to.not.have.been.called;
      });
    });

    context('when the server configuration has been stored', () => {
      it('should stop the server', () => {
        sandbox.stub(deviceLoader, 'loadDevices').returns([buildSampleDevice()]);

        return startDevices({ brainHost: '10.0.0.1' }).then(() => {
          stopDevices();
          expect(sdk.stopServer).to.have.been.called;
        });
      });
    });
  });

  describe('startDevices', () => {
    context('when no devices are found', () => {
      it('should exit process', () => {
        const sdkOptions = {
          brainHost: '10.0.0.1',
        };
        sandbox.stub(deviceLoader, 'loadDevices').returns([]);
        sandbox.stub(process, 'exit').returns({});

        return startDevices(sdkOptions).then(() => {
          expect(process.exit).to.have.been.calledOnce;
        });
      });
    });

    context('when brain host is configured', () => {
      it('should start the server on given brain host', () => {
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

      context('when brain host is not configured', () => {
        it('should start the server against the first discovered brain', () => {
          // @ts-ignore
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
      .addButtonHandler(() => {})
      .build();
  }
});
