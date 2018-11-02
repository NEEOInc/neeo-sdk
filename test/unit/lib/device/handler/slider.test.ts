'use strict';

import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as Slider from '../../../../../src/lib/device/handler/slider';

describe('./lib/device/handler/slider.ts', () => {
  it('should call the sliderGet function of the controller, controller returns promise', (done) => {
    const value = 5;
    let sliderTriggered = false;
    function handler() {
      sliderTriggered = true;
      return BluePromise.resolve(value);
    }
    Slider.sliderGet(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(sliderTriggered).to.equal(true);
      done();
    });
  });

  it('should call the sliderGet function of the controller, controller returns value', (done) => {
    const value = 5;
    let sliderTriggered = false;
    function handler() {
      sliderTriggered = true;
      return value;
    }
    Slider.sliderGet(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(sliderTriggered).to.equal(true);
      done();
    });
  });

  it('should call the sliderSet function of the controller, controller returns promise', (done) => {
    const deviceId = 'id1';
    const value = 5;
    let valueFromController = 0;
    let deviceIdFromController = 0;
    let sliderTriggered = false;
    function handler(inputDeviceId, inputValueFromController) {
      sliderTriggered = true;
      valueFromController = inputValueFromController;
      deviceIdFromController = inputDeviceId;
      return BluePromise.resolve();
    }
    Slider.sliderSet(handler, value, deviceId).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      expect(sliderTriggered).to.equal(true);
      expect(valueFromController).to.equal(value);
      expect(deviceIdFromController).to.equal(deviceId);
      done();
    });
  });

  it('should call the sliderSet function of the controller, controller returns value', (done) => {
    const deviceId = 'id1';
    const value = 5;
    let valueFromController = 0;
    let deviceIdFromController = 0;
    let sliderTriggered = false;
    function handler(inputDeviceId, inputValueFromController) {
      sliderTriggered = true;
      valueFromController = inputValueFromController;
      deviceIdFromController = inputDeviceId;
    }
    Slider.sliderSet(handler, value, deviceId).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      expect(sliderTriggered).to.equal(true);
      expect(valueFromController).to.equal(value);
      expect(deviceIdFromController).to.equal(deviceId);
      done();
    });
  });
});
