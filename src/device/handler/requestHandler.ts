import * as Debug from 'debug';
import { Database } from '../database';
import * as Models from '../../models';
import * as discover from './discover';
import * as button from './button';
import * as textLabel from './textLabel';
import * as imageUrl from './imageUrl';
import * as slider from './slider';
import * as onOff from './switch';
import * as directory from './directory';
import * as register from './registration';
import * as deviceSubscriptions from './deviceSubscriptions';

const debug = Debug('neeo:device:RequestHandler');
const SUCCESS = { success: true };

export class RequestHandler {
  constructor(readonly deviceDatabase: Database) {
    if (!deviceDatabase) {
      throw new Error('INVALID_DEVICE_DATABASE');
    }
  }

  searchDevice(query: string) {
    return this.deviceDatabase.search(query);
  }

  getDevice(id: number) {
    return this.deviceDatabase.getDevice(id);
  }

  getDeviceByAdapterId(adapterId: string) {
    return this.deviceDatabase.getDeviceByAdapterId(adapterId);
  }

  discover(handler: { controller: Models.DiscoveryResult.Controller }) {
    if (!handler) {
      return Promise.reject(new Error('INVALID_DISCOVER_PARAMETER'));
    }
    const { controller } = handler;
    return checkForFunction(controller).then(discover.run);
  }

  isRegistered(handler: Models.CapabilityHandler) {
    debug('isRegistered?');
    if (!handler || !handler.controller) {
      return Promise.reject(new Error('INVALID_REGISTERED_PARAMETER'));
    }
    const handlerFunction = ((handler.controller as any) as Models.Registration.Controller)
      .isRegistered;
    return checkForFunction(handlerFunction).then(register.isRegistered);
  }

  register(handler: Models.CapabilityHandler, userdata: any) {
    debug('register');
    if (!handler || !handler.controller) {
      return Promise.reject(new Error('INVALID_REGISTER_PARAMETER'));
    }
    const handlerFunction = ((handler.controller as any) as Models.Registration.Controller)
      .register;
    return checkForFunction(handlerFunction).then(fn => {
      return register.register(fn, userdata);
    });
  }

  handleAction(device: {
    handler: Models.CapabilityHandler;
    deviceId: string;
    body?: any;
  }): Promise<any> {
    if (deviceIsInvalid(device)) {
      debug('handleraction failed %o', device);
      return Promise.reject(new Error('INVALID_ACTION_PARAMETER'));
    }
    const {
      handler: { componentType },
      deviceId,
      body: params
    } = device;
    let handlerFunction;
    debug('process action request for', componentType);
    switch (componentType) {
      case 'directory':
        handlerFunction = (device.handler
          .controller as Models.DirectoryDescriptor.Controller).action;
        return checkForFunction(handlerFunction).then(handler => {
          return directory.callAction(handler, deviceId, params);
        });
      default:
        debug('INVALID_ACTION_COMPONENT %o', { component: componentType });
        return Promise.reject(
          new Error(`INVALID_ACTION_COMPONENT: ${componentType}`)
        );
    }
  }

  handleGet(device: {
    deviceId: string;
    handler: Models.CapabilityHandler;
    body?: any;
  }): Promise<any> {
    if (deviceIsInvalid(device)) {
      debug('handlerget failed %o', device);
      return Promise.reject(new Error('INVALID_GET_PARAMETER'));
    }
    const {
      deviceId,
      handler: { componentType, controller },
      body: params
    } = device;
    debug('process get request for', componentType);
    switch (componentType) {
      case 'button':
        return checkForFunction(controller as any).then(handler => {
          return button.trigger(deviceId, handler);
        });
      case 'textlabel':
        return checkForFunction(controller as any).then(handler => {
          return textLabel.getText(handler, deviceId);
        });
      case 'imageurl':
        return checkForFunction(controller as any).then(handler => {
          return imageUrl.getImageUri(handler, deviceId);
        });
      case 'sensor':
      case 'slider':
        return checkForFunction((controller as any).getter).then(handler => {
          return slider.sliderGet(handler, deviceId);
        });
      case 'switch':
        return checkForFunction((controller as any).getter).then(handler => {
          return onOff.switchGet(handler, deviceId);
        });
      case 'directory':
        return checkForFunction((controller as any).getter).then(handler => {
          return directory.directoryGet(handler, deviceId, params);
        });
    }
    debug('INVALID_GET_COMPONENT %o', { component: componentType });
    return Promise.reject(new Error('INVALID_GET_COMPONENT'));
  }

  handleSet(device: {
    deviceId: string;
    handler: Models.CapabilityHandler;
    value: any;
  }) {
    if (deviceIsInvalid(device)) {
      debug('handlerset failed %o', device);
      return Promise.reject(new Error('INVALID_SET_PARAMETER'));
    }
    const {
      deviceId,
      handler: { componentType, controller },
      value
    } = device;
    debug('process set request for', componentType, value);
    switch (componentType) {
      case 'slider':
        return checkForFunction((controller as any).setter).then(handler => {
          return slider.sliderSet(handler, value, deviceId);
        });
      case 'switch':
        return checkForFunction((controller as any).setter).then(handler => {
          return onOff.switchSet(handler, value === 'true', deviceId);
        });
    }
    debug('INVALID_SET_COMPONENT %o', { component: componentType });
    return Promise.reject(new Error('INVALID_SET_COMPONENT'));
  }

  subscribe(handler: Models.CapabilityHandler, deviceId: string) {
    if (!handler || !handler.controller) {
      return Promise.resolve(SUCCESS);
    }
    const handlerFunction = ((handler.controller as any) as Models.DeviceSubscriptionHandler.Controller)
      .deviceAdded;
    return checkForFunction(handlerFunction).then(fn => {
      return deviceSubscriptions.deviceAdded(fn, deviceId);
    });
  }

  unsubscribe(handler: Models.CapabilityHandler, deviceId: string) {
    if (!handler || !handler.controller) {
      return Promise.resolve(SUCCESS);
    }
    const handlerFunction = ((handler.controller as any) as Models.DeviceSubscriptionHandler.Controller)
      .deviceRemoved;
    return checkForFunction(handlerFunction).then(fn => {
      return deviceSubscriptions.deviceRemoved(fn, deviceId);
    });
  }
}

function deviceIsInvalid(device: {
  deviceId: string;
  handler: Models.CapabilityHandler;
}) {
  return (
    !device ||
    !device.handler ||
    !device.handler.componentType ||
    !device.handler.controller
  );
}

function checkForFunction<T extends Function>(func: T) {
  return new Promise<T>((resolve, reject) => {
    return typeof func !== 'function'
      ? reject(new Error('CONTROLLER_IS_NOT_A_FUNCTION'))
      : resolve(func);
  });
}
