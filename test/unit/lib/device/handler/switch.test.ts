'use strict';

import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as Switch from '../../../../../src/lib/device/handler/switch';

describe('./lib/device/handler/switch.ts', () => {
  it('should call the switchGet function of the controller, controller returns promise', (done) => {
    const value = true;
    let switchTriggered = false;
    function handler() {
      switchTriggered = true;
      return BluePromise.resolve(value);
    }
    Switch.switchGet(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(switchTriggered).to.equal(true);
      done();
    });
  });

  it('should call the switchGet function of the controller, controller returns value', (done) => {
    const value = true;
    let switchTriggered = false;
    function handler() {
      switchTriggered = true;
      return value;
    }
    Switch.switchGet(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(switchTriggered).to.equal(true);
      done();
    });
  });

  it('should call the switchSet function of the controller, controller returns promise', (done) => {
    const value = false;
    const deviceid = 'id1';
    let valueFromController = false;
    let deviceidFromController = null;
    let switchTriggered = false;
    function handler(inputDeviceidFromController, inputValueFromController) {
      switchTriggered = true;
      deviceidFromController = inputDeviceidFromController;
      valueFromController = inputValueFromController;
      return BluePromise.resolve();
    }
    Switch.switchSet(handler, value, deviceid).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      expect(switchTriggered).to.equal(true);
      expect(valueFromController).to.equal(value);
      expect(deviceidFromController).to.equal(deviceid);
      done();
    });
  });

  it('should call the switchSet function of the controller, controller returns value', (done) => {
    const value = false;
    const deviceid = 'id1';
    let valueFromController = false;
    let deviceidFromController = null;
    let switchTriggered = false;
    function handler(inputDeviceidFromController, inputValueFromController) {
      switchTriggered = true;
      deviceidFromController = inputDeviceidFromController;
      valueFromController = inputValueFromController;
    }
    Switch.switchSet(handler, value, deviceid).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      expect(switchTriggered).to.equal(true);
      expect(valueFromController).to.equal(value);
      expect(deviceidFromController).to.equal(deviceid);
      done();
    });
  });
});
