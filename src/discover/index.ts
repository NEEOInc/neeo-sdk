import * as Debug from 'debug';
import * as os from 'os';
import * as Models from '../models';
import findFirstNeeoBrain, { BrainServiceEntry } from './mdns';

const debug = Debug('neeo:discover:discovery');

/**
 * Convert a bonjour service entry into a NEEO brain model.
 * @param service Bonjour service entry.
 */
function buildModel(service: BrainServiceEntry): Models.BrainModel {
  debug('buildNeeoEntry %o', service);
  const {
    name,
    host,
    port,
    addresses,
    txt: { rel, reg }
  } = service;
  return {
    name,
    host,
    port,
    version: rel,
    region: reg,
    iparray: addresses
  };
}

/**
 * Returns a promise to the first NEEO Brain discovered on the local network.
 * @param multiInterface Specifies whether to search for a brain on all interfaces (optional, default is false).
 * If you have a mdns discovery service e.g. Bonjour, it must be turned off in advance.
 * @return Promise of the found NEEOBrain.
 * @example
 * neeoapi.discoverOneBrain()
    .then((brain) => {
      ...
    }
 */
export function discoverOneBrain(multiInterface?: boolean) {
  if (!multiInterface) {
    return findFirstNeeoBrain().then(buildModel);
  }
  const interfaces = os.networkInterfaces();
  const promises = Object.keys(interfaces)
    .map(key =>
      interfaces[key]
        .filter(({ internal, family }) => !internal && family === 'IPv4')
        .map(({ address }) => findFirstNeeoBrain(address))
    )
    .reduce((output, array) => {
      output.push(...array);
      return output;
    }, []);
  return Promise.race(promises)
    .then(buildModel)
    .catch(error => {
      throw Array.isArray(error) ? error[0] : error;
    });
}
