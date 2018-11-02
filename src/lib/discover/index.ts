import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import * as os from 'os';
import * as brainLookup from './brainLookup';

const debug = Debug('neeo:discover:discover');
/**
 * @module NEEOBrain
 * @description The NEEO Brain module represents a NEEO Brain in your local network and contains information about
 * the Brain itself. This model is used to connect to a NEEO Brain. Note: you can also use the hostname of a NEEO
 * Brain to connect to a specific Brain (if discovery is not feasible).
 * @example
 * {
 *   name: 'NEEO Living Room',
 *   host: 'NEEO-0ff36d11.local.',
 *   port: 3000,
 *   version: 0.26.2-b786b7a,
 *   region: US,
 *   iparray: [ '192.168.1.33' ]
 * }
 */

/**
 * Returns a promise to the first NEEO Brain discovered on the local network.
 * @function
 * @see {@link NEEOBrain}
 * @param {Boolean} multiInterface to allow to search for a brain on all interfaces (optional, default is false).
 * If you have a mdns discovery service e.g. Bonjour, it must be turned off in advance.
 * @return {promise} promise contains the found NEEOBrain.
 * @example
 * neeoapi.discoverOneBrain(true)
 *   .then((brain) => {
 *    ...
 *  }
 */
export function discoverOneBrain(multiInterface?: any) {
  if (!multiInterface) {
    return findFirstBrain().then(toBrain);
  }

  const interfaces = os.networkInterfaces();
  const discoveryPromises = Object.keys(interfaces)
    .map((net) =>
      interfaces[net]
        .filter((netInfo) => netInfo.internal === false && netInfo.family === 'IPv4')
        .map((netIf) => findFirstBrain(netIf.address))
    )
    .reduce((result, currentInterface) => result.concat(currentInterface));

  return BluePromise.any(discoveryPromises)
    .then(toBrain)
    .catch((aggregateError) => {
      throw aggregateError[0];
    });
}

function toBrain(service) {
  debug('buildNeeoEntry %o', service);
  return {
    name: service.name,
    host: service.host,
    port: service.port,
    version: service.txt.rel,
    region: service.txt.reg,
    iparray: service.addresses,
  };
}

function findFirstBrain(networkInterface?: any) {
  return brainLookup.findFirstBrain(networkInterface).toPromise();
}
