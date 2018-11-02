import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import config from '../../../../src/lib/config';
import * as Brain from '../../../../src/lib/device/brain';
import * as Device from '../../../../src/lib/device/index';
import { DeviceBuilder } from '../../../../src/lib/models';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('./lib/device/index.ts', () => {
  const sandbox = sinon.createSandbox();
  const BRAINADDR = '10.0.0.2';
  const CONFNAME = 'NEEO';
  const BRAINPORT = 3000;

  let brainDriver;
  let callbackConf;
  let callbackRequesthandler;
  let callbackStop;
  let configStub;
  let nockScope;

  beforeEach(() => {
    configStub = sandbox.stub(config);

    configStub.brainVersionSatisfaction = '0.49.0 - 0.50.0';

    brainDriver = {
      start(conf, requestHandler) {
        callbackConf = conf;
        callbackRequesthandler = requestHandler;

        return Promise.resolve();
      },
      stop(conf) {
        callbackStop = conf;
      },
    };

    sandbox.stub(Brain, 'getSubscriptions').resolves([]);

    nockScope = nock(`http://${BRAINADDR}:${BRAINPORT}`);
  });

  afterEach(() => {
    nockScope.done();
    nock.restore();
    nock.activate();
    sandbox.restore();
  });

  describe('buildCustomDevice', () => {
    context('when adaptername is missing', () => {
      it('should throw an error', () => {
        expect(() => {
          // @ts-ignore
          Device.buildCustomDevice();
        }).to.throw(/MISSING_ADAPTERNAME/);
      });
    });

    it('should buildCustomDevice', () => {
      const result = Device.buildCustomDevice('foo', 'bar');
      expect(result.manufacturer).to.equal('NEEO');
      expect(result.devicename).to.equal('foo');
    });
  });

  describe('startServer', () => {
    context('when the parameter is missing', () => {
      it('should throw an error', () => {
        // @ts-ignore
        return expect(Device.startServer()).rejectedWith('INVALID_STARTSERVER_PARAMETER');
      });
    });

    it('should start the brainDriver', () => {
      nockScope
        .post('/v1/api/registerSdkDeviceAdapter')
        .reply(200)
        .get('/systeminfo')
        .reply(200, { firmwareVersion: '0.49.0' });
      const conf = buildConfWithCustomDevice();

      return Device.startServer(conf, brainDriver).then(() => {
        expect(callbackConf.brain).to.equal(BRAINADDR);
        expect(callbackConf.name).to.equal(CONFNAME);
        expect(typeof callbackRequesthandler).to.equal('object');
      });
    });

    context('when the Brain version is out of configured range', () => {
      ['0.47.0', '0.50.1'].forEach((version) => {
        it('should throw an error', () => {
          nockScope.get('/systeminfo').reply(200, {
            firmwareVersion: version,
          });

          const conf = buildConfWithCustomDevice();

          return expect(Device.startServer(conf, brainDriver)).rejectedWith(
            'The Brain version must satisfy 0.49.0 - 0.50.0. Please make sure that the firmware is up-to-date.'
          );
        });
      });
    });

    context('when a device uses subscriptions', () => {
      it('should fetch the subscriptions for that device', () => {
        const device = buildValidCustomDevice().registerDeviceSubscriptionHandler({
          deviceAdded: () => {},
          deviceRemoved: () => {},
          initializeDeviceList: () => {},
        });
        const conf = buildConfWithCustomDevice(device);

        nockScope
          .post('/v1/api/registerSdkDeviceAdapter')
          .reply(200)
          .get('/systeminfo')
          .reply(200, { firmwareVersion: '0.49.0' });

        return Device.startServer(conf, brainDriver).then(() => {
          expect(Brain.getSubscriptions).to.have.been.calledWith(device.deviceidentifier);
        });
      });

      it('should handle subscription errors', () => {
        const device = buildValidCustomDevice().registerDeviceSubscriptionHandler({
          deviceAdded: () => {},
          deviceRemoved: () => {},
          initializeDeviceList: () => {},
        });
        const conf = buildConfWithCustomDevice(device);
        (Brain.getSubscriptions as any).rejects(new Error('unit test'));

        nockScope
          .post('/v1/api/registerSdkDeviceAdapter')
          .reply(200)
          .get('/systeminfo')
          .reply(200, { firmwareVersion: '0.49.0' });

        return Device.startServer(conf, brainDriver).then(() => {
          expect(Brain.getSubscriptions).to.have.been.calledWith(device.deviceidentifier);
        });
      });
    });
  });

  describe('stopServer', () => {
    context('when the parameter is missing', () => {
      it('should fail to stopServer', () => {
        // @ts-ignore
        return expect(Device.stopServer()).rejectedWith('INVALID_STOPSERVER_PARAMETER');
      });
    });

    it('should stop the brainDriver', () => {
      nockScope
        .post('/v1/api/registerSdkDeviceAdapter')
        .reply(200)
        .get('/systeminfo')
        .reply(200, { firmwareVersion: '0.49.0' })
        .post('/v1/api/unregisterSdkDeviceAdapter')
        .reply(200);

      const conf = buildConfWithCustomDevice();

      return Device.startServer(conf, brainDriver)
        .then(() => {
          return Device.stopServer(conf);
        })
        .then(() => {
          expect(callbackStop.brain).to.equal(BRAINADDR);
          expect(callbackStop.name).to.equal(CONFNAME);
        });
    });
  });

  it('should register device subscription', () => {
    const NAME = 'bar';
    const DEVICENAME = 'updateDevice';
    const brainNotifiationKeys = [
      { name: 'albumcover', eventKey: '6241612146438832128:IMAGEURL_SENSOR' },
    ];
    let notificationCallback;
    const subscriptionHandler = (notificationFunction) => {
      notificationCallback = notificationFunction;
    };

    nockScope
      .post('/v1/api/registerSdkDeviceAdapter')
      .reply(200)
      .get('/systeminfo')
      .reply(200, {
        firmwareVersion: '0.49.0',
      })
      .get(/v1\/api\/notificationkey\/[^/]*\/[^/]*\/0001/)
      .reply(200, brainNotifiationKeys)
      .post('/v1/notifications', {
        type: config.sensorUpdateKey,
        data: {
          sensorEventKey: brainNotifiationKeys[0].eventKey,
          sensorValue: 50,
        },
      })
      .reply(200)
      .post('/v1/api/unregisterSdkDeviceAdapter')
      .reply(200);

    const device = Device.buildCustomDevice(DEVICENAME, '123')
      .addImageUrl({ name: 'albumcover', size: 'small' }, () => 'foo')
      .registerSubscriptionFunction(subscriptionHandler);

    const notificationMsg = {
      uniqueDeviceId: '0001',
      component: 'albumcover',
      value: 50,
    };

    const conf = {
      port: 3000,
      brain: BRAINADDR,
      name: NAME,
      devices: [device],
    };

    return Device.startServer(conf, brainDriver)
      .then(() => {
        expect(notificationCallback).to.be.a('function');
        // TODO call callback with some update and check notification is called...
        return notificationCallback(notificationMsg);
      })
      .then(() => Device.stopServer(conf))
      .then(() => {
        nockScope.done();
        expect(callbackStop.brain).to.equal(BRAINADDR);
        expect(callbackStop.name).to.equal(NAME);
      });
  });

  function buildValidCustomDevice() {
    return Device.buildCustomDevice('myDevice', '123').addImageUrl(
      { name: 'albumcover', size: 'small' },
      () => 'imageURI'
    );
  }

  function buildConfWithCustomDevice(device?: DeviceBuilder) {
    if (!device) {
      device = buildValidCustomDevice();
    }
    return {
      port: BRAINPORT,
      brain: BRAINADDR,
      name: CONFNAME,
      devices: [device],
    };
  }
});
