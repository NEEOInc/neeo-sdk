'use strict';

const BluePromise = require('bluebird');
const deviceLoader = require('./deviceloader');
const sdk = require('../lib');

let serverConfiguration;

module.exports = {
  startDevices,
  stopDevices,
};

function stopDevices() {
  if (!serverConfiguration) {
    return;
  }
  sdk.stopServer(serverConfiguration)
    .catch((error) => {
      console.error('ERROR!', error.message);
      process.exit(1);
    });
}

function startDevices(sdkOptions) {
  return BluePromise.all([
      loadDevices(),
      getBrain(sdkOptions),
    ])
    .then((results) => {
      const [devices, brain] = results;
      console.info('- Start server, connect to NEEO Brain:', {
        brain: brain.name || 'unknown',
        host: brain.host,
        port: brain.port,
      });
      storeSdkServerConfiguration(brain, sdkOptions, devices);
      return sdk.startServer(serverConfiguration);
    })
    .then(() => {
      console.info('# Your devices are now ready to use in the NEEO app!');
    })
    .catch((error) => {
      console.error('ERROR!', error);
      process.exit(1);
    });
}

function storeSdkServerConfiguration(brain, sdkOptions, devices) {
  const { serverPort, serverName } = sdkOptions;
  serverConfiguration = {
    brain,
    port: serverPort || process.env.ADAPTERPORT || 6336,
    name: serverName || 'default',
    adapterIpAddress: process.env.ADAPTERIPADDRESS,
    baseurl: process.env.BASEURL,
    devices,
  };
}

function loadDevices() {
  return new BluePromise((resolve, reject) => {
    const devices = deviceLoader.loadDevices();

    const noDevicesDefined = devices.length === 0;

    if (noDevicesDefined) {
      return reject(new Error(
        'No devices found! Make sure you expose devices in the "devices" directory ' +
        'or install external drivers through npm.'
      ));
    }

    resolve(devices);
  });
}

function getBrain(sdkOptions) {
  return isBrainDefinedIn(sdkOptions) ? getBrainFrom(sdkOptions) : findBrain();
}

function isBrainDefinedIn(sdkOptions) {
  const { brainHost } = sdkOptions;
  return (brainHost && brainHost !== '') || process.env.BRAINIP;
}

function getBrainFrom(sdkOptions) {
  const { brainHost, brainPort } = sdkOptions;
  return BluePromise.resolve({
    host: brainHost || process.env.BRAINIP,
    port: brainPort || 3000,
  });
}

function findBrain() {
  console.info('No Brain address configured, attempting to discover one...');
  return sdk.discoverOneBrain().then((brain) => {
    console.info('- Brain discovered:', brain.name);

    return brain;
  });
}
