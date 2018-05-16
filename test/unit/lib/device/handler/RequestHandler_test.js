'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const RequestHandler = require('../../../../../lib/device/handler/RequestHandler');

describe('./lib/device/handler/index.js', function() {
  let db;
  let requestHandler;

  beforeEach(function() {
    db = {
      search: sinon.stub(),
      getDevice: sinon.stub(),
      getDeviceByAdapterId: sinon.stub(),
    };
    requestHandler = new RequestHandler(db);
  });

  it('should handle getDeviceByAdapterId', function() {
    const adapterId = '123';
    requestHandler.getDeviceByAdapterId(adapterId);
    expect(db.getDeviceByAdapterId).to.have.been.calledWith(adapterId);
  });

  it('should handle searchDevice', function() {
    // GIVEN
    const query = 'NEEO Brain';

    // WHEN
    requestHandler.searchDevice(query);

    // THEN
    expect(db.search).to.have.been.calledWith(query);
  });

  it('should handle getDevice', function() {
    // GIVEN
    const id = 'NEEO Brain';

    // WHEN
    requestHandler.getDevice(id);

    // THEN
    expect(db.getDevice).to.have.been.calledWith(id);
  });

  describe('discover()', function() {
    it('should fail without controller', function() {
      return requestHandler.discover()
        .catch((error) => {
          expect(error.message).to.equal('INVALID_DISCOVER_PARAMETER');
        });
    });

    it('should fail with invalid controller', function() {
      return requestHandler.discover({ controller: 123 })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should forward data to register handler', function() {
      const handler = {
        controller: sinon.stub().resolves([]),
      };

      return requestHandler.discover(handler)
        .then(() => {
          expect(handler.controller).to.have.been.calledOnce;
        });
    });
  });

  describe('isRegistered()', function() {
    it('should fail with invalid controller', function() {
      return requestHandler.isRegistered({})
        .catch((error) => {
          expect(error.message).to.equal('INVALID_REGISTERED_PARAMETER');
        });
    });

    it('should fail with non function controller', function() {
      return requestHandler.isRegistered({ controller: 123 })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should forward data to register handler', function() {
      const handler = {
        controller: {
          isRegistered: sinon.stub(),
        },
      };

      return requestHandler.isRegistered(handler)
        .then(() => {
          expect(handler.controller.isRegistered).to.have.been.calledOnce;
        });
    });
  });

  describe('register()', function() {
    it('should fail with invalid controller', function() {
      return requestHandler.register({})
        .catch((error) => {
          expect(error.message).to.equal('INVALID_REGISTER_PARAMETER');
        });
    });

    it('should fail with non function controller', function() {
      return requestHandler.register({ controller: 123 })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should forward data to register handler', function() {
      const handler = {
        controller: {
          register: sinon.stub(),
        },
      };
      const userData = { securityCode: 'unit test' };
      return requestHandler.register(handler, userData)
        .then(() => {
          expect(handler.controller.register).to.have.been.calledWith(userData);
        });
    });
  });

  describe('subscribe()', function() {
    it('should skip device without controller', function() {
      return requestHandler.subscribe({})
        .then((response) => {
          expect(response.success).to.equal(true);
        });
    });

    it('should fail with non function deviceAdded', function() {
      return requestHandler.subscribe({ controller: {} })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should forward data to deviceAdded handler', function() {
      const handler = {
        controller: {
          deviceAdded: sinon.stub(),
        },
      };
      const deviceId = '41';
      return requestHandler.subscribe(handler, deviceId)
        .then(() => {
          expect(handler.controller.deviceAdded).to.have.been.calledWith(deviceId);
        });
    });
  });

  describe('unsubscribe()', function() {
    it('should skip device without controller', function() {
      return requestHandler.unsubscribe({})
        .then((response) => {
          expect(response.success).to.equal(true);
        });
    });

    it('should fail with non function deviceRemoved', function() {
      return requestHandler.unsubscribe({ controller: {} })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should forward data to deviceRemoved handler', function() {
      const handler = {
        controller: {
          deviceRemoved: sinon.stub(),
        },
      };
      const deviceId = '41';
      return requestHandler.unsubscribe(handler, deviceId)
        .then(() => {
          expect(handler.controller.deviceRemoved).to.have.been.calledWith(deviceId);
        });
    });
  });

  describe('handleGet()', function() {
    it('should fail without parameter', function() {
      return requestHandler.handleGet()
        .catch((error) => {
          expect(error.message).to.equal('INVALID_GET_PARAMETER');
        });
    });

    it('should fail with invalid componenttype', function() {
      return requestHandler.handleGet({
          handler: {
            componenttype: 'foo',
            controller: {}
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_GET_COMPONENT');
        });
    });

    it('should fail without controller', function() {
      return requestHandler.handleGet({
          handler: {
            componenttype: 'switch',
            controller: {}
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });
  });

  describe('handleAction()', function() {
    it('should fail without parameter', function() {
      return requestHandler.handleAction()
        .catch((error) => {
          expect(error.message).to.equal('INVALID_ACTION_PARAMETER');
        });
    });

    it('should fail with invalid componenttype', function() {
      return requestHandler.handleAction({
          handler: {
            componenttype: 'foo',
            controller: {}
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_ACTION_COMPONENT: foo');
        });
    });

    it('should fail without controller', function() {
      return requestHandler.handleAction({
          handler: {
            componenttype: 'directory',
            controller: {}
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });
  });

  describe('handleSet()', function() {
    it('should fail without parameter', function() {
      return requestHandler.handleSet()
        .catch((error) => {
          expect(error.message).to.equal('INVALID_SET_PARAMETER');
        });
    });

    it('should failwithout controller', function() {
      return requestHandler.handleSet({
          handler: {
            componenttype: 'switch'
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('INVALID_SET_PARAMETER');
        });
    });

    it('should failwithout controller', function() {
      return requestHandler.handleSet({
          handler: {
            componenttype: 'switch',
            controller: {}
          },
        })
        .catch((error) => {
          expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
        });
    });

    it('should call controller setter with boolean for switch components', function() {
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
