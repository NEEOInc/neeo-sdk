import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import * as Models from '../../models';
import { Database } from '../database';
import * as button from './button';
import * as deviceSubscriptions from './deviceSubscriptions';
import * as directory from './directory';
import * as discover from './discover';
import * as favorite from './favorite';
import * as imageUrl from './imageUrl';
import * as register from './registration';
import * as slider from './slider';
import * as onOff from './switch';
import * as textLabel from './textLabel';

const debug = Debug('neeo:device:RequestHandler');
const SUCCESS = { success: true };

interface Device {
  handler: any;
  deviceId: string;
  body?: any;
}

// TODO use this type in deviceRoute
interface DeviceRequestModel {
    // Note: Device above uses deviceId with uppercase I
    deviceid: string;
    handler: Models.CapabilityHandler;
    body?: any;
    value?: any;
}

export class RequestHandler {
  public static build(deviceDatabase: Database) {
    return new RequestHandler(deviceDatabase);
  }

  public readonly discoveredDynamicDevices: Map<string, Device>;

  constructor(readonly deviceDatabase: Database) {
    if (!deviceDatabase) {
      throw new Error('INVALID_DEVICE_DATABASE');
    }
    this.deviceDatabase = deviceDatabase;
    this.discoveredDynamicDevices = new Map();
  }

  public searchDevice(query: string) {
    return this.deviceDatabase.search(query);
  }

  public getDevice(id: number) {
    return this.deviceDatabase.getDevice(id);
  }

  public getAdapterDefinition(adapterName: string) {
    return this.deviceDatabase.getAdapterDefinition(adapterName);
  }

  public getDeviceByAdapterId(adapterId: string) {
    return this.deviceDatabase.getDeviceByAdapterId(adapterId);
  }

  public registerDiscoveredDevice(deviceId: string, device: Device) {
    this.discoveredDynamicDevices.set(deviceId, device);
    debug('added device, db size:', this.discoveredDynamicDevices.size);
  }

  public getDiscoveredDeviceComponentHandler(deviceId, componentName) {
    const device = this.discoveredDynamicDevices.get(deviceId);
    if (!device) {
      return;
    }
    return device.handler.get(componentName);
  }

  public discover(handler: { controller: any }, optionalDeviceId?: string) {
    if (!handler || !handler.controller) {
      return BluePromise.reject(new Error('INVALID_DISCOVER_PARAMETER'));
    }
    const { controller: handlerFunction } = handler;
    return checkForFunction(handlerFunction).then(() =>
      discover.run(handlerFunction, this.registerDiscoveredDevice.bind(this), optionalDeviceId)
    );
  }

  public isRegistered(handler: Models.CapabilityHandler | undefined) {
    debug('isRegistered?');
    if (!handler || !handler.controller) {
      return BluePromise.reject(new Error('INVALID_REGISTERED_HANDLER'));
    }
    const handlerFunction = ((handler.controller as any) as Models.Registration.Controller)
      .isRegistered;
    return checkForFunction(handlerFunction).then(() => register.isRegistered(handlerFunction));
  }

  public register(handler: Models.CapabilityHandler, userdata: any) {
    debug('register');
    if (!handler || !handler.controller) {
      return BluePromise.reject(new Error('INVALID_REGISTER_HANDLER'));
    }
    const handlerFunction = ((handler.controller as any) as Models.Registration.Controller)
      .register;

    return checkForFunction(handlerFunction).then(() =>
      register.register(handlerFunction, userdata)
    );
  }

  public handleAction(device: DeviceRequestModel): Promise<any> {
    if (deviceIsInvalid(device)) {
      debug('handleraction failed %o', device);
      return BluePromise.reject(new Error('INVALID_ACTION_PARAMETER'));
    }
    const {
      handler: { componenttype },
      deviceid,
      body: params,
    } = device;
    let handlerFunction;
    debug('process action request for', componenttype);
    switch (componenttype) {
      case 'directory':
        handlerFunction = (device.handler.controller as Models.Directory.Controller)
          .action;
        return checkForFunction(handlerFunction).then((handler) => {
          return directory.callAction(handler, deviceid, params);
        });
      default:
        debug('INVALID_ACTION_COMPONENT %o', { component: componenttype });
        return BluePromise.reject(new Error(`INVALID_ACTION_COMPONENT: ${componenttype}`));
    }
  }

  public handleGet(device: DeviceRequestModel): Promise<any> {
    if (deviceIsInvalid(device)) {
      debug('handlerget failed %o', device);
      return BluePromise.reject(new Error('INVALID_GET_PARAMETER'));
    }
    const {
      deviceid,
      handler: { componenttype, controller },
      body: params,
    } = device;
    debug('process get request for %s:%s', componenttype, deviceid);
    switch (componenttype) {
      case 'button':
        return checkForFunction(controller as any).then((handler) => {
          return button.trigger(deviceid, handler);
        });
      case 'textlabel':
        return checkForFunction(controller as any).then((handler) => {
          return textLabel.getText(handler, deviceid);
        });
      case 'imageurl':
        return checkForFunction(controller as any).then((handler) => {
          return imageUrl.getImageUri(handler, deviceid);
        });
      case 'sensor':
      case 'slider':
        return checkForFunction((controller as any).getter).then((handler) => {
          return slider.sliderGet(handler, deviceid);
        });
      case 'switch':
        return checkForFunction((controller as any).getter).then((handler) => {
          return onOff.switchGet(handler, deviceid);
        });
      case 'directory':
        return checkForFunction((controller as any).getter).then((handler) => {
          return directory.directoryGet(handler, deviceid, params);
        });
      case 'favoritehandler':
        return checkForFunction(controller.execute as any).then((handler) => {
          return favorite.execute(handler, deviceid, params);
        });
    }
    debug('INVALID_GET_COMPONENT %o', { component: componenttype });
    return BluePromise.reject(new Error('INVALID_GET_COMPONENT'));
  }

  public handleSet(device: DeviceRequestModel) {
    if (deviceIsInvalid(device)) {
      debug('handlerset failed %o', device);
      return BluePromise.reject(new Error('INVALID_SET_PARAMETER'));
    }
    const {
      deviceid,
      handler: { componenttype, controller },
      value,
    } = device;
    debug('process set request for', componenttype, value);
    switch (componenttype) {
      case 'slider':
        return checkForFunction((controller as any).setter).then((handler) => {
          return slider.sliderSet(handler, value, deviceid);
        });
      case 'switch':
        return checkForFunction((controller as any).setter).then((handler) => {
          return onOff.switchSet(handler, value === 'true', deviceid);
        });
    }
    debug('INVALID_SET_COMPONENT %o', { component: componenttype });
    return BluePromise.reject(new Error('INVALID_SET_COMPONENT'));
  }

  public subscribe(handler: Models.CapabilityHandler, deviceId: string) {
    if (!handler || !handler.controller) {
      return BluePromise.resolve(SUCCESS);
    }

    const handlerFunction = ((handler.controller as any) as Models.DeviceSubscriptionHandler.Controller)
      .deviceAdded;

    return checkForFunction(handlerFunction).then((fn) => {
      return deviceSubscriptions.deviceAdded(fn, deviceId);
    });
  }

  public unsubscribe(handler: Models.CapabilityHandler, deviceId: string) {
    if (!handler || !handler.controller) {
      return BluePromise.resolve(SUCCESS);
    }

    const handlerFunction = ((handler.controller as any) as Models.DeviceSubscriptionHandler.Controller)
      .deviceRemoved;

    return checkForFunction(handlerFunction).then((fn) => {
      return deviceSubscriptions.deviceRemoved(fn, deviceId);
    });
  }
}

function deviceIsInvalid(device: DeviceRequestModel) {
  return !device ||
    !device.handler ||
    !device.handler.componenttype ||
    !device.handler.controller;
}

function checkForFunction<
  T extends ((id: string) => void) | PromiseLike<void> | Models.Discovery.Controller
>(func: T) {
  return new Promise<T>((resolve, reject) => {
    return typeof func !== 'function'
      ? reject(new Error('CONTROLLER_IS_NOT_A_FUNCTION'))
      : resolve(func);
  });
}
