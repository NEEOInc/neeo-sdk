import { expect } from 'chai';
import * as sinon from 'sinon';
import * as dynamicDevice from '../../../../src/lib/dynamicDevice/dynamicDevice';

describe('./lib/dynamicDevice/dynamicDevice.ts', () => {
  const sandbox = sinon.createSandbox();
  let mockRequestHandler;

  beforeEach(() => {
    mockRequestHandler = {
      getDiscoveredDeviceComponentHandler: sandbox.stub(),
      discover: sandbox.stub(),
    };
    dynamicDevice.registerHandler(mockRequestHandler);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('storeDataInRequest', () => {
    const ID = '123';
    const COMPONENT = 'abutton';

    it('should store data in request for later use', () => {
      const req: { dynamicAdapter?: any } = {};
      const adapterName = 'adapterName';
      const component = 'component';
      // @ts-ignore
      dynamicDevice.storeDataInRequest(req, adapterName, component);
      expect(req.dynamicAdapter).to.deep.equal({ adapterName, component });
    });

    it('should find prebuild dynamic device', () => {
      const req: { dynamicAdapter: any; handler?: any } = {
        dynamicAdapter: {
          deviceid: ID,
          component: COMPONENT,
        },
      };
      mockRequestHandler.getDiscoveredDeviceComponentHandler.returns('foo');

      return dynamicDevice.storeDiscoveryHandlerInRequest(req).then((handler) => {
        expect(handler).to.equal('foo');
        expect(req.handler).to.equal(handler);
        expect(req.dynamicAdapter).to.deep.equal({
          deviceid: ID,
          component: COMPONENT,
        });
        expect(mockRequestHandler.getDiscoveredDeviceComponentHandler.callCount).to.equal(1);
        expect(mockRequestHandler.discover.callCount).to.equal(0);
      });
    });

    it('should find build dynamic device, request device from driver', () => {
      let requestHandler;
      const req: { dynamicAdapter: any; adapter: any; handler?: any } = {
        dynamicAdapter: {
          deviceid: ID,
          component: COMPONENT,
        },
        adapter: {
          handler: {
            get: (handler) => {
              requestHandler = handler;
              return 'anobject';
            },
          },
        },
      };

      mockRequestHandler.discover.resolves('discoveredDevice');
      mockRequestHandler.getDiscoveredDeviceComponentHandler
        .onFirstCall()
        .returns()
        .onSecondCall()
        .returns('foo');

      return dynamicDevice.storeDiscoveryHandlerInRequest(req).then((handler) => {
        expect(handler).to.equal('foo');
        expect(req.handler).to.equal(handler);
        expect(requestHandler).to.equal('discover');
        expect(req.dynamicAdapter).to.deep.equal({
          deviceid: ID,
          component: COMPONENT,
        });
        expect(mockRequestHandler.getDiscoveredDeviceComponentHandler.callCount).to.equal(2);
        expect(mockRequestHandler.discover.callCount).to.equal(1);
      });
    });
  });

  describe('validateDeviceIdRoute', () => {
    it('should fail to validate route when deviceId is missing', () => {
      const req = {};
      const result = dynamicDevice.validateDeviceIdRoute(req);
      expect(result).to.equal(false);
    });

    it('should validate route when deviceId is provided and static handler is registered', () => {
      const req = {
        deviceid: 1,
        handler: 'FOO',
      };
      const result = dynamicDevice.validateDeviceIdRoute(req);
      expect(result).to.equal(true);
    });

    it('should validate route when deviceId is provided and dynamic handler is registered', () => {
      const req = {
        deviceid: 1,
        dynamicAdapter: 'FOO',
      };
      const result = dynamicDevice.validateDeviceIdRoute(req);
      expect(result).to.equal(true);
    });
  });
});
