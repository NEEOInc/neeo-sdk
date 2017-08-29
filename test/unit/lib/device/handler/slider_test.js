'use strict';

const expect = require('chai').expect;
const Slider = require('../../../../../lib/device/handler/slider');
const BluePromise = require('bluebird');

describe('./lib/device/handler/slider.js', function() {

  it('should call the sliderGet function of the controller, controller returns promise', function(done) {
    const value = 5;
    let sliderTriggered = false;
    function handler() {
      sliderTriggered = true;
      return BluePromise.resolve(value);
    }
    Slider.sliderGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(sliderTriggered).to.equal(true);
        done();
      });
  });

  it('should call the sliderGet function of the controller, controller returns value', function(done) {
    const value = 5;
    let sliderTriggered = false;
    function handler() {
      sliderTriggered = true;
      return value;
    }
    Slider.sliderGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(sliderTriggered).to.equal(true);
        done();
      });
  });

  it('should call the sliderSet function of the controller, controller returns promise', function(done) {
    const deviceId = 'id1';
    const value = 5;
    let valueFromController = 0;
    let deviceIdFromController = 0;
    let sliderTriggered = false;
    function handler(_deviceId, _valueFromController) {
      sliderTriggered = true;
      valueFromController = _valueFromController;
      deviceIdFromController = _deviceId;
      return BluePromise.resolve();
    }
    Slider.sliderSet(handler, value, deviceId)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        expect(sliderTriggered).to.equal(true);
        expect(valueFromController).to.equal(value);
        expect(deviceIdFromController).to.equal(deviceId);
        done();
      });
  });

  it('should call the sliderSet function of the controller, controller returns value', function(done) {
    const deviceId = 'id1';
    const value = 5;
    let valueFromController = 0;
    let deviceIdFromController = 0;
    let sliderTriggered = false;
    function handler(_deviceId, _valueFromController) {
      sliderTriggered = true;
      valueFromController = _valueFromController;
      deviceIdFromController = _deviceId;
    }
    Slider.sliderSet(handler, value, deviceId)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        expect(sliderTriggered).to.equal(true);
        expect(valueFromController).to.equal(value);
        expect(deviceIdFromController).to.equal(deviceId);
        done();
      });
  });

});
