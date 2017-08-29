'use strict';

const expect = require('chai').expect;
const Switch = require('../../../../../lib/device/handler/switch');
const BluePromise = require('bluebird');

describe('./lib/device/handler/switch.js', function() {

  it('should call the switchGet function of the controller, controller returns promise', function(done) {
    const value = true;
    let switchTriggered = false;
    function handler() {
      switchTriggered = true;
      return BluePromise.resolve(value);
    }
    Switch.switchGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(switchTriggered).to.equal(true);
        done();
      });
  });

  it('should call the switchGet function of the controller, controller returns value', function(done) {
    const value = true;
    let switchTriggered = false;
    function handler() {
      switchTriggered = true;
      return value;
    }
    Switch.switchGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(switchTriggered).to.equal(true);
        done();
      });
  });

  it('should call the switchSet function of the controller, controller returns promise', function(done) {
    const value = false;
    const deviceid = 'id1';
    let valueFromController = false;
    let deviceidFromController = null;
    let switchTriggered = false;
    function handler(_deviceidFromController, _valueFromController) {
      switchTriggered = true;
      deviceidFromController = _deviceidFromController;
      valueFromController = _valueFromController;
      return BluePromise.resolve();
    }
    Switch.switchSet(handler, value, deviceid)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        expect(switchTriggered).to.equal(true);
        expect(valueFromController).to.equal(value);
        expect(deviceidFromController).to.equal(deviceid);
        done();
      });
  });

  it('should call the switchSet function of the controller, controller returns value', function(done) {
    const value = false;
    const deviceid = 'id1';
    let valueFromController = false;
    let deviceidFromController = null;
    let switchTriggered = false;
    function handler(_deviceidFromController, _valueFromController) {
      switchTriggered = true;
      deviceidFromController = _deviceidFromController;
      valueFromController = _valueFromController;
    }
    Switch.switchSet(handler, value, deviceid)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        expect(switchTriggered).to.equal(true);
        expect(valueFromController).to.equal(value);
        expect(deviceidFromController).to.equal(deviceid);
        done();
      });
  });

});
