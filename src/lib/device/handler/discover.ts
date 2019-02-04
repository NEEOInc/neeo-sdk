import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import * as Models from '../../models';

const debug = Debug('neeo:device:express:route:handler:discover');

function validateDevices(devices: Models.Discovery.Result[]) {
  return devices.every((device) => {
    if (!(device instanceof Object) && !Array.isArray(device)) {
      return false;
    }
    if (!device.hasOwnProperty('id')) {
      return false;
    }
    if (!device.hasOwnProperty('name')) {
      return false;
    }

    return true;
  });
}

function uniqueDeviceIdCheck(devices: Models.Discovery.Result[]) {
  const uniqueIds = Object.keys(
    devices.reduce((reduced, device) => {
      reduced[device.id] = device.name;
      return reduced;
    }, {})
  );

  return uniqueIds.length === devices.length;
}

export function run(
  handler: Models.Discovery.Controller,
  registerDiscoveredDeviceFunction: (deviceId: string, device: any) => any,
  optionalDeviceId?: string
) {
  return BluePromise.resolve(handler(optionalDeviceId)).then((discoveredDevicesArray) => {
    if (optionalDeviceId && !Array.isArray(discoveredDevicesArray) && discoveredDevicesArray) {
      debug('single device detected, wrap it into array');
      discoveredDevicesArray = [discoveredDevicesArray];
    }
    if (!Array.isArray(discoveredDevicesArray)) {
      debug('Discovery result invalid, not an array', typeof discoveredDevicesArray);
      return BluePromise.reject(new Error('INVALID_DISCOVERY_ANSWER_NOT_AN_ARRAY'));
    }

    if (!validateDevices(discoveredDevicesArray)) {
      debug('Discovery result invalid, invalid device data');
      return BluePromise.reject(new Error('INVALID_DISCOVERY_ITEM_DATA'));
    }

    if (!uniqueDeviceIdCheck(discoveredDevicesArray)) {
      debug('Discovery result invalid, duplicate device ids');
      return BluePromise.reject(new Error('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS'));
    }

    return discoveredDevicesArray.map((discoveredDevice) => {
      const isDeviceBuildFunctionValid =
        discoveredDevice.device && typeof discoveredDevice.device.build === 'function';
      debug(
        'discovered brain %s, isDeviceBuildFunctionValid %s',
        discoveredDevice.name,
        isDeviceBuildFunctionValid
      );
      const result: {
        id: string;
        name: string;
        device?: any;
        reachable?: boolean;
        room?: any;
      } = {
        id: discoveredDevice.id,
        name: discoveredDevice.name,
      };
      const device = isDeviceBuildFunctionValid ? discoveredDevice.device.build() : undefined;
      if (device) {
        result.device = device;
        debug('register discovered device', discoveredDevice.id);
        registerDiscoveredDeviceFunction(discoveredDevice.id, device);
      }
      if (typeof discoveredDevice.reachable !== 'undefined') {
        result.reachable = discoveredDevice.reachable;
      }
      if (typeof discoveredDevice.room !== 'undefined') {
        result.room = discoveredDevice.room;
      }

      return result;
    });
  });
}
