'use strict';

const debug = require('debug')('neeo:device:express:route:handler:RequestHandler');
const BluePromise = require('bluebird');

const button = require('./button.js');
const slider = require('./slider.js');
const onOff = require('./switch.js');
const discover = require('./discover.js');

function checkForFunction(handlerFunction) {
  if (typeof handlerFunction !== 'function') {
    return BluePromise.reject(new Error('CONTROLLER_IS_NOT_A_FUNCTION'));
  }
  return BluePromise.resolve();
}

module.exports.discover = function(data) {
  if (!data || !data.controller) {
    return BluePromise.reject(new Error('INVALID_DISCOVER_PARAMETER'));
  }
  const handlerFunction = data.controller;
  return checkForFunction(handlerFunction)
    .then(() => {
      return discover.run(handlerFunction);
    });
};

module.exports.handleGet = function(data) {
  if (!data || !data.handler || !data.handler.componenttype || !data.handler.controller) {
    debug('handlerget failed %o', data);
    return BluePromise.reject(new Error('INVALID_GET_PARAMETER'));
  }
  const component = data.handler.componenttype;
  const deviceid = data.deviceid;
  let handlerFunction;
  debug('process get request for', component);

  switch (component) {
    case 'button':
      handlerFunction = data.handler.controller;
      return checkForFunction(handlerFunction)
        .then(() => {
          return button.trigger(deviceid, handlerFunction);
        });

    case 'sensor':
    case 'slider':
      handlerFunction = data.handler.controller.getter;
      return checkForFunction(handlerFunction)
        .then(() => {
          return slider.sliderGet(handlerFunction, deviceid);
        });

    case 'switch':
      handlerFunction = data.handler.controller.getter;
      return checkForFunction(handlerFunction)
        .then(() => {
          return onOff.switchGet(handlerFunction, data.value, deviceid);
        });

    default:
      debug('INVALID_GET_COMPONENT %o', { component });
      return BluePromise.reject(new Error('INVALID_GET_COMPONENT'));
    }
};


module.exports.handleSet = function(data) {
  if (!data || !data.handler || !data.handler.componenttype || !data.handler.controller) {
    return BluePromise.reject(new Error('INVALID_SET_PARAMETER'));
  }
  const component = data.handler.componenttype;
  const deviceid = data.deviceid;
  let handlerFunction;
  debug('process set request for', component, data.value);

  switch (component) {
    case 'slider':
      handlerFunction = data.handler.controller.setter;
      return checkForFunction(handlerFunction)
        .then(() => {
          return slider.sliderSet(handlerFunction, data.value, deviceid);
        });
    case 'switch':
      handlerFunction = data.handler.controller.setter;
      return checkForFunction(handlerFunction)
        .then(() => {
          return onOff.switchSet(handlerFunction, data.value, deviceid);
        });

    default:
      debug('INVALID_SET_COMPONENT %o', { component });
      return BluePromise.reject(new Error('INVALID_SET_COMPONENT'));
  }

};
