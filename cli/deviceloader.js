'use strict';

const debug = require('debug')('neeo:cli:DeviceLoader');
const fs = require('fs');
const path = require('path');
const config = require('../lib/config');

module.exports = {
  loadDevices,
};

function loadDevices() {
  let localDevices = [];
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

function isNeeoDriver(driverPath, file) {
  const isNeeoPrefixed = (file) =>
    file.startsWith('neeo-') || file.startsWith('neeo_');
  const devicesIndexPath = path.join(driverPath, file, 'devices', 'index.js');

  return isNeeoPrefixed(file) && fs.existsSync(devicesIndexPath);
}

function getPathFromCwdTo(directory) {
  return path.join(process.cwd(), directory);
}

function loadDevicesFrom({ rootPath, directory, filter }) {
  return fs
    .readdirSync(rootPath)
    .filter(filter)
    .map((file) => {
      try {
        debug('try to load driver from', rootPath, file);
        const devicesPath = path.join(rootPath, file, directory);
        return require(devicesPath).devices;
      } catch (error) {
        console.error(
          `could not load devices in file ${file}: ${error.message}`
        );
      }
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter((device) => device);
}

function isExcludedFromDeviceSearch(file) {
  return config.devicesExcludedDirectories.indexOf(file) === -1;
}
