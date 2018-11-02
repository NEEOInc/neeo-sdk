// tslint:disable:no-console

import * as Debug from 'debug';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { DeviceBuilder } from '..';
import config from '../lib/config';

const debug = Debug('neeo:cli:DeviceLoader');

export function loadDevices() {
  let localDevices: DeviceBuilder[] = [];
  try {
    localDevices = getLocalDevices();
  } catch (err) {
    debug('SKIPPED_LOCAL_DRIVERS', err.message);
    // We ignore missing local devices
    if (err && !err.message.includes('ENOENT')) {
      throw err;
    }
  }

  const externalDevices = getExternalDevices();
  const devices = [...localDevices, ...externalDevices];

  return devices;
}

function getLocalDevices() {
  const localDriverPath = getPathFromCwdTo(config.devicesDirectory);

  return loadDevicesFrom({
    rootPath: localDriverPath,
    directory: '',
    filter: (file) => isExcludedFromDeviceSearch(file),
  });
}

function getExternalDevices() {
  const externalDriversPath = getPathFromCwdTo('node_modules');

  return loadDevicesFrom({
    rootPath: externalDriversPath,
    directory: 'devices',
    filter: (file) => isNeeoDriver(externalDriversPath, file),
  });
}

function isNeeoDriver(driverPath: string, file: string) {
  const isNeeoPrefixed = file.startsWith('neeo-') || file.startsWith('neeo_');
  const deviceIndexFileExists = existsSync(join(driverPath, file, 'devices', 'index.js'));

  return isNeeoPrefixed && deviceIndexFileExists;
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
    .map((file) => {
      try {
        debug('try to load driver from', rootPath, file);
        const devicesPath = join(rootPath, file, directory);
        return require(devicesPath).devices;
      } catch (error) {
        console.error(`Could not load devices in file '${file}': ${error.message}`);
        console.error('DRIVER LOAD FAILED STACKTRACE:\n', error.stack);
      }
      return [];
    })
    .reduce((output, array) => output.concat(array), [])
    .filter((device: DeviceBuilder) => device);
}
