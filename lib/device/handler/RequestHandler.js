'use strict';

const debug = require('debug')('neeo:device:RequestHandler');
const BluePromise = require('bluebird');

const button = require('./button.js');
const textlabel = require('./textlabel.js');
const imageurl = require('./imageurl.js');
const slider = require('./slider.js');
const onOff = require('./switch.js');
const discover = require('./discover.js');

class RequestHandler {
  constructor(deviceDatabase) {
    if (!deviceDatabase) {
      throw new Error('INVALID_DEVICE_DATABASE');
    }
    this.deviceDatabase = deviceDatabase;
  }

  searchDevice(query) {
    return this.deviceDatabase.search(query);
  }

  getDevice(id) {
    return this.deviceDatabase.getDevice(id);
  }

  getDeviceByAdapterId(adapterId) {
    return this.deviceDatabase.getDeviceByAdapterId(adapterId);
  }

  discover(handler) {
    if (!handler || !handler.controller) {
      return BluePromise.reject(new Error('INVALID_DISCOVER_PARAMETER'));
    }
    const handlerFunction = handler.controller;
    return checkForFunction(handlerFunction)
      .then(() => discover.run(handlerFunction));
  }

  handleGet(device) {
    if (deviceIsInvalid(device)) {
      debug('handlerget failed %o', device);
      return BluePromise.reject(new Error('INVALID_GET_PARAMETER'));
    }
    const component = device.handler.componenttype;
    const deviceid = device.deviceid;
    let handlerFunction;
    debug('process get request for', component);

    switch (component) {
      case 'button':
        handlerFunction = device.handler.controller;
        return checkForFunction(handlerFunction)
          .then(() => {
            return button.trigger(deviceid, handlerFunction);
          });

      case 'textlabel':
        handlerFunction = device.handler.controller;
        return checkForFunction(handlerFunction)
          .then(() => {
            return textlabel.getText(handlerFunction, deviceid);
          });

      case 'imageurl':
        handlerFunction = device.handler.controller;
        return checkForFunction(handlerFunction)
          .then(() => {
            return imageurl.getImageUri(handlerFunction, deviceid);
          });

      case 'sensor':
      case 'slider':
        handlerFunction = device.handler.controller.getter;
        return checkForFunction(handlerFunction)
          .then(() => {
            return slider.sliderGet(handlerFunction, deviceid);
          });

      case 'switch':
        handlerFunction = device.handler.controller.getter;
        return checkForFunction(handlerFunction)
          .then(() => {
            return onOff.switchGet(handlerFunction, deviceid);
          });

      default:
        debug('INVALID_GET_COMPONENT %o', { component });
        return BluePromise.reject(new Error('INVALID_GET_COMPONENT'));
      }
  }

  handleSet(device) {
    if (deviceIsInvalid(device)) {
      return BluePromise.reject(new Error('INVALID_SET_PARAMETER'));
    }
    const component = device.handler.componenttype;
    const deviceid = device.deviceid;
    let handlerFunction;
    debug('process set request for', component, device.value);

    switch (component) {
      case 'slider':
        handlerFunction = device.handler.controller.setter;
        return checkForFunction(handlerFunction)
          .then(() => {
            return slider.sliderSet(handlerFunction, device.value, deviceid);
          });
      case 'switch':
        handlerFunction = device.handler.controller.setter;
        return checkForFunction(handlerFunction)
          .then(() => {
            return onOff.switchSet(handlerFunction, device.value, deviceid);
          });

      default:
        debug('INVALID_SET_COMPONENT %o', { component });
        return BluePromise.reject(new Error('INVALID_SET_COMPONENT'));
    }
  }
}

module.exports = RequestHandler;

function deviceIsInvalid(device) {
  return !device || !device.handler ||
    !device.handler.componenttype || !device.handler.controller;
}

function checkForFunction(handlerFunction) {
  if (typeof handlerFunction !== 'function') {
    return BluePromise.reject(new Error('CONTROLLER_IS_NOT_A_FUNCTION'));
  }
  return BluePromise.resolve();
}
