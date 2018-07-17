import {
  BrainModel,
  DeviceBuilder,
  StartServerConfig,
  discoverOneBrain,
  startServer,
  stopServer
} from '..';
import * as deviceLoader from './deviceLoader';

let serverConfiguration: StartServerConfig;

export function stopDevices() {
  if (!serverConfiguration) {
    return;
  }
  stopServer(serverConfiguration).catch(error => {
    console.error('ERROR!', error.message);
    process.exit();
  });
}

export type SdkOptions = {
  brainHost?: string;
  brainPort?: number;
  serverPort?: number;
  serverName?: string;
};

export function startDevices(options: SdkOptions = {}) {
  return Promise.all([loadDevices(), getBrain(options)])
    .then(([devices, brain]) => {
      console.info('- Start server, connect to NEEO Brain:', {
        brain: brain.name || 'unknown',
        host: brain.host,
        port: brain.port
      });
      storeSdkServerConfiguration(brain, options, devices);
      return startServer(serverConfiguration);
    })
    .then(() => {
      console.info('# Your devices are now ready to use in the NEEO app!');
    })
    .catch(error => {
      console.error('ERROR!', error);
      process.exit(1);
    });
}

function storeSdkServerConfiguration(
  brain: BrainModel,
  { serverPort, serverName }: SdkOptions,
  devices: DeviceBuilder[]
) {
  serverConfiguration = {
    brain,
    port: serverPort || 6336,
    name: serverName || 'default',
    devices
  };
}

function getBrain(options: SdkOptions) {
  return isBrainDefinedIn(options) ? getBrainFrom(options) : findBrain();
}

function isBrainDefinedIn({ brainHost }: SdkOptions) {
  return !!brainHost;
}

function loadDevices() {
  return new Promise<DeviceBuilder[]>((resolve, reject) => {
    const devices = deviceLoader.loadDevices();
    if (!devices.length) {
      return reject(
        new Error(
          'No devices found! Make sure you expose devices in the "devices" directory ' +
            'or install external drivers through npm.'
        )
      );
    }
    resolve(devices);
  });
}

function getBrainFrom({ brainHost, brainPort }: SdkOptions) {
  return Promise.resolve({
    host: brainHost!,
    port: brainPort || 3000,
    name: `${brainHost}:${brainPort || 3000}`
  } as BrainModel);
}

function findBrain() {
  console.info('No Brain address configured, attempting to discover one...');
  return discoverOneBrain().then(brain => {
    console.info('- Brain discovered:', brain.name);
    return brain;
  });
}
