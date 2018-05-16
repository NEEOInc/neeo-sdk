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
  sdk.stopServer(serverConfiguration);
}

function startDevices(sdkOptions) {
  checkDevicesDefined();

  return getBrain(sdkOptions)
    .then((brain) => {
      console.info('- Start server');
      storeSdkServerConfiguration(brain, sdkOptions);
      return sdk.startServer(serverConfiguration);
    })
    .then(() => {
      console.info('# Your devices are now ready to use in the NEEO app!');
    })
    .catch((err) => {
      console.error('ERROR!', err);
      process.exit(1);
    });
}

function storeSdkServerConfiguration(brain, sdkOptions) {
  const { serverPort, serverName } = sdkOptions;
  serverConfiguration = {
    brain,
    port: serverPort || 6336,
    name: serverName || 'default',
    devices: deviceLoader.loadDevices(),
  };
}

function checkDevicesDefined() {
  if (deviceLoader.loadDevices().length === 0) {
    throw new Error(
      'No devices found! Make sure you expose some devices in the devices directory.'
    );
  }
}

function getBrain(sdkOptions) {
  return isBrainDefinedIn(sdkOptions) ? getBrainFrom(sdkOptions) : findBrain();
}

function isBrainDefinedIn(sdkOptions) {
  const { brainHost } = sdkOptions;
  return brainHost && brainHost !== '';
}

function getBrainFrom(sdkOptions) {
  const { brainHost, brainPort } = sdkOptions;
  return BluePromise.resolve({
    host: brainHost,
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
