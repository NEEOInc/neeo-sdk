import * as Debug from 'debug';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { DeviceBuilder } from '..';
import config from '../config';

const debug = Debug('neeo:cli:DeviceLoader');

export function loadDevices() {
  let localDevices: DeviceBuilder[];
  try {
    localDevices = getLocalDevices();
  } catch (err) {
    debug('SKIPPED_LOCAL_DRIVERS', err.message);
    // We ignore missing local devices
    if (err && !err.message.includes('ENOENT')) {
      throw err;
    }
    localDevices = [];
  }
  return [...localDevices, ...getExternalDevices()];
}

function getLocalDevices() {
  return loadDevicesFrom({
    rootPath: getPathFromCwdTo(config.devicesDirectory),
    filter: isExcludedFromDeviceSearch
  });
}

function getExternalDevices() {
  const nodeModules = getPathFromCwdTo('node_modules');
  return loadDevicesFrom({
    rootPath: nodeModules,
    directory: 'devices',
    filter: file => isNeeoDriver(nodeModules, file)
  });
}

function isNeeoDriver(driverPath: string, file: string) {
  return (
    (file.startsWith('neeo-') || file.startsWith('neeo_')) &&
    existsSync(join(driverPath, file, 'devices', 'index.js'))
  );
}

const getPathFromCwdTo = (directory: string) => join(process.cwd(), directory);

function isExcludedFromDeviceSearch(file: string) {
  return config.devicesExcludedDirectories.indexOf(file) === -1;
}

interface Options {
  rootPath: string;
  directory?: string;
  filter: (file: string) => boolean;
}

function loadDevicesFrom({ rootPath, filter, directory = '' }: Options) {
  return readdirSync(rootPath)
    .filter(filter)
    .map(file => {
      try {
        const { devices } = require(join(rootPath, file, directory));
        if (Array.isArray(devices)) {
          return devices.filter(device => !!device) as DeviceBuilder[];
        }
      } catch (error) {
        console.error(
          `Could not load devices in file '${file}': ${error.message}`
        );
      }
      return [];
    })
    .reduce((output, array) => {
      output.push(...array);
      return output;
    }, []);
}
