import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as Discover from '../../../../../src/lib/device/handler/discover';

describe('./lib/device/handler/discover.ts', () => {
  it('should call the run function of the controller, controller returns array wrapped in a promise', () => {
    const value = [{ id: 1, name: 'first' }, { id: 2, name: 'second' }, { id: 3, name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return BluePromise.resolve(value);
    }

    // @ts-ignore
    return Discover.run(handler).then((answer) => {
      expect(answer).to.deep.equal(value);
      expect(handlerTriggered).to.equal(true);
    });
  });

  it('should call the run function of the controller, controller returns array', () => {
    const value = [
      { id: '1', name: 'first' },
      { id: '2', name: 'second' },
      { id: '3', name: 'third' },
    ];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }

    // @ts-ignore
    return Discover.run(handler).then((answer) => {
      expect(answer).to.deep.equal(value);
      expect(handlerTriggered).to.equal(true);
    });
  });

  it('should wrap single discovery object into array when optionalDeviceId is passed', () => {
    const value = { id: 1, name: 'first' };

    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }

    // @ts-ignore
    return Discover.run(handler, () => {}, 1).then((answer) => {
      expect(answer).to.deep.equal([value]);
      expect(handlerTriggered).to.equal(true);
    });
  });

  it('should register sdk device when build', () => {
    const ID = 123;
    const DEVICE_MOCK = 'BULDDEVICE';
    const DEVICE_ID = 'DEVICE_ID';
    let registerTriggered = false;
    let registerData = {};
    const mockHandler = () => {
      return {
        id: DEVICE_ID,
        name: 'name',
        device: {
          build: () => {
            return DEVICE_MOCK;
          },
        },
      };
    };

    function registerDynamicDevice(id, device) {
      registerTriggered = true;
      registerData = { id, device };
    }
    // @ts-ignore
    return Discover.run(mockHandler, registerDynamicDevice, ID).then(() => {
      expect(registerData).to.deep.equal({
        device: DEVICE_MOCK,
        id: DEVICE_ID,
      });
      expect(registerTriggered).to.equal(true);
    });
  });

  it('should build dynamic device in handler, ignore invalid device objects', () => {
    const value = [{ id: 1, name: 'first', device: 'foo' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    // @ts-ignore
    return Discover.run(handler).then((answer) => {
      expect(answer).to.deep.equal([{ id: 1, name: 'first' }]);
      expect(handlerTriggered).to.equal(true);
    });
  });

  it('should build dynamic device in handler, build dynamic device', () => {
    const DISCOVER_RESULT = [
      {
        id: 1,
        name: 'first',
        device: {
          build: () => {
            return 'mock';
          },
        },
      },
    ];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return DISCOVER_RESULT;
    }
    let deviceId;
    let device;
    // tslint:disable-next-line:variable-name
    function registerDiscoveredDeviceFunction(_deviceId, _device) {
      deviceId = _deviceId;
      device = _device;
    }
    // @ts-ignore
    return Discover.run(handler, registerDiscoveredDeviceFunction).then((answer) => {
      expect(answer).to.deep.equal([{ id: 1, name: 'first', device: 'mock' }]);
      expect(handlerTriggered).to.equal(true);
      expect(deviceId).to.equal(1);
      expect(device).to.equal('mock');
    });
  });

  it('should call the run function of the controller, controller returns invalid data wrapped in a promise', (done) => {
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return BluePromise.resolve();
    }

    // @ts-ignore
    Discover.run(handler).catch((error) => {
      expect(error.message).to.equal('INVALID_DISCOVERY_ANSWER_NOT_AN_ARRAY');
      expect(handlerTriggered).to.equal(true);
      done();
    });
  });

  it('should call the run function of the controller, controller returns array invalid item data', (done) => {
    const value = [1, 'foo', true, [], null, undefined];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    // @ts-ignore
    Discover.run(handler).catch((error) => {
      expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
      expect(handlerTriggered).to.equal(true);
      done();
    });
  });

  it('should call the run function of the controller, controller returns items missing "id" property', (done) => {
    const value = [{ name: 'first' }, { name: 'second' }, { name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    // @ts-ignore
    Discover.run(handler).catch((error) => {
      expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
      expect(handlerTriggered).to.equal(true);
      done();
    });
  });

  it('should call the run function of the controller, controller returns  items missing "name" property', (done) => {
    const value = [{ id: 1 }, { id: 1 }, { id: 3 }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    // @ts-ignore
    Discover.run(handler).catch((error) => {
      expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
      expect(handlerTriggered).to.equal(true);
      done();
    });
  });

  it('should call the run function of the controller, controller returns array with a duplicate device id', (done) => {
    const value = [{ id: 1, name: 'first' }, { id: 1, name: 'second' }, { id: 3, name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    // @ts-ignore
    Discover.run(handler).catch((error) => {
      expect(error.message).to.equal('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS');
      expect(handlerTriggered).to.equal(true);
      done();
    });
  });
});
