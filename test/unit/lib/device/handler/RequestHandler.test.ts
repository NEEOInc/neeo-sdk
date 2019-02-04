'use strict';

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;
import * as sinon from 'sinon';
import { RequestHandler } from '../../../../../src/lib/device/handler/requestHandler';

describe('./lib/device/handler/index.ts', () => {
  let db;
  let requestHandler;

  beforeEach(() => {
    db = {
      search: sinon.stub(),
      getDevice: sinon.stub(),
      getDeviceByAdapterId: sinon.stub(),
      getAdapterDefinition: sinon.stub(),
    };
    requestHandler = new RequestHandler(db);
  });

  it('should handle getDeviceByAdapterId', () => {
    const adapterId = '123';
    requestHandler.getDeviceByAdapterId(adapterId);
    expect(db.getDeviceByAdapterId).to.have.been.calledWith(adapterId);
  });

  it('should handle searchDevice', () => {
    // GIVEN
    const query = 'NEEO Brain';

    // WHEN
    requestHandler.searchDevice(query);

    // THEN
    expect(db.search).to.have.been.calledWith(query);
  });

  it('should handle getDevice', () => {
    // GIVEN
    const id = 'NEEO Brain';

    // WHEN
    requestHandler.getDevice(id);

    // THEN
    expect(db.getDevice).to.have.been.calledWith(id);
  });

  it('should handle getAdapterDefinition', () => {
    // GIVEN
    const adapterName = 'apt-123456789012345678901234567890';

    // WHEN
    requestHandler.getAdapterDefinition(adapterName);

    // THEN
    expect(db.getAdapterDefinition).to.have.been.calledWith(adapterName);
  });

  describe('discover()', () => {
    it('should fail without controller', () => {
      return requestHandler.discover().catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVER_PARAMETER');
      });
    });

    it('should fail with invalid controller', () => {
      return requestHandler.discover({ controller: 123 }).catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
    });

    it('should forward data to register handler', () => {
      const handler = {
        controller: sinon.stub().resolves([]),
      };

      return requestHandler.discover(handler).then(() => {
        expect(handler.controller).to.have.been.calledOnce;
      });
    });

    it('should forward optional deviceid to controller handler', () => {
      const handler = {
        controller: sinon.stub().resolves([]),
      };
      const OPTIONAL_DEVICEID = 123;

      return requestHandler.discover(handler, OPTIONAL_DEVICEID).then(() => {
        expect(handler.controller.getCall(0).args[0]).to.deep.equal(OPTIONAL_DEVICEID);
      });
    });
  });

  describe('isRegistered()', () => {
    it('should fail with invalid controller', () => {
      return requestHandler.isRegistered({}).catch((error) => {
        expect(error.message).to.equal('INVALID_REGISTERED_HANDLER');
      });
    });

    it('should fail with non function controller', () => {
      return requestHandler.isRegistered({ controller: 123 }).catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
    });

    it('should forward data to register handler', () => {
      const handler = {
        controller: {
          isRegistered: sinon.stub(),
        },
      };

      return requestHandler.isRegistered(handler).then(() => {
        expect(handler.controller.isRegistered).to.have.been.calledOnce;
      });
    });
  });

  describe('register()', () => {
    it('should fail with invalid controller', () => {
      return requestHandler.register({}).catch((error) => {
        expect(error.message).to.equal('INVALID_REGISTER_HANDLER');
      });
    });

    it('should fail with non function controller', () => {
      return requestHandler.register({ controller: 123 }).catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
    });

    it('should forward data to register handler', () => {
      const handler = {
        controller: {
          register: sinon.stub(),
        },
      };
      const userData = { securityCode: 'unit test' };
      return requestHandler.register(handler, userData).then(() => {
        expect(handler.controller.register).to.have.been.calledWith(userData);
      });
    });
  });

  describe('subscribe()', () => {
    it('should skip device without controller', () => {
      return requestHandler.subscribe({}).then((response) => {
        expect(response.success).to.equal(true);
      });
    });

    it('should fail with non function deviceAdded', () => {
      return requestHandler.subscribe({ controller: {} }).catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
    });

    it('should forward data to deviceAdded handler', () => {
      const handler = {
        controller: {
          deviceAdded: sinon.stub(),
        },
      };
      const deviceId = '41';
      return requestHandler.subscribe(handler, deviceId).then(() => {
        expect(handler.controller.deviceAdded).to.have.been.calledWith(deviceId);
      });
    });
  });

  describe('unsubscribe()', () => {
    it('should skip device without controller', () => {
      return requestHandler.unsubscribe({}).then((response) => {
        expect(response.success).to.equal(true);
      });
    });

    it('should fail with non function deviceRemoved', () => {
      return requestHandler.unsubscribe({ controller: {} }).catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
    });

    it('should forward data to deviceRemoved handler', () => {
      const handler = {
        controller: {
          deviceRemoved: sinon.stub(),
        },
      };
      const deviceId = '41';
      return requestHandler.unsubscribe(handler, deviceId).then(() => {
        expect(handler.controller.deviceRemoved).to.have.been.calledWith(deviceId);
      });
    });
  });

  describe('handleGet()', () => {
    it('should fail without parameter', () => {
      return requestHandler.handleGet().catch((error) => {
        expect(error.message).to.equal('INVALID_GET_PARAMETER');
      });
    });

    it('should fail with invalid componenttype', () => {
      return requestHandler
        .handleGet({
          handler: {
            componenttype: 'foo',
            controller: {},
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_GET_COMPONENT');
        });
    });

    it('should fail without controller', () => {
      return requestHandler
        .handleGet({
          handler: {
            componenttype: 'switch',
            controller: {},
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });
  });

  describe('handleAction()', () => {
    it('should fail without parameter', () => {
      return requestHandler.handleAction().catch((error) => {
        expect(error.message).to.equal('INVALID_ACTION_PARAMETER');
      });
    });

    it('should fail with invalid componenttype', () => {
      return requestHandler
        .handleAction({
          handler: {
            componenttype: 'foo',
            controller: {},
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_ACTION_COMPONENT: foo');
        });
    });

    it('should fail without controller', () => {
      return requestHandler
        .handleAction({
          handler: {
            componenttype: 'directory',
            controller: {},
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });
  });

  describe('handleSet()', () => {
    it('should fail without parameter', () => {
      return requestHandler.handleSet().catch((error) => {
        expect(error.message).to.equal('INVALID_SET_PARAMETER');
      });
    });

    it('should failwithout controller', () => {
      return requestHandler
        .handleSet({
          handler: {
            componenttype: 'switch',
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_SET_PARAMETER');
        });
    });

    it('should failwithout controller', () => {
      return requestHandler
        .handleSet({
          handler: {
            componenttype: 'switch',
            controller: {},
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should call controller setter with boolean for switch components', () => {
      let switchState;
      const controller = {
        setter: (_, newValue) => (switchState = newValue),
        getter: () => {},
      };

      return requestHandler
        .handleSet({
          handler: {
            componenttype: 'switch',
            controller,
          },
          value: 'true',
        })
        .then(() => {
          expect(switchState).to.equal(true);
        });
    });
  });
});
