'use strict';

const debug = require('debug')('neeo:discover:discover');
const mdns = require('./mdns');
const os = require('os');
const BluePromise = require('bluebird');

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

/** */ // avoid doxdox thinking the @module above is for this function.
function buildNEEOBrainModel(service) {
  debug('buildNeeoEntry %o', service);
  return {
    name: service.name,
    host: service.host,
    port: service.port,
    version: service.txt.rel,
    region: service.txt.reg,
    iparray: service.addresses
  };
}

function findFirstNeeoBrain(multiInterface) {
  if (!multiInterface) {
    return mdns.findFirstNeeoBrain()
      .then(buildNEEOBrainModel);
  } else {
    const interfaces = os.networkInterfaces();
    const discoveryPromises = Object.keys(interfaces).map((net) =>
      interfaces[net]
        .filter((netInfo) => netInfo.internal === false && netInfo.family === 'IPv4')
        .map((netIf) => mdns.findFirstNeeoBrain(netIf.address)))
      .reduce((result, currentInterface) => result.concat(currentInterface));

    return BluePromise.any(discoveryPromises)
      .then(buildNEEOBrainModel)
      .catch(aggregateError => {
        throw aggregateError[0];
      });
  }
}

module.exports.discoverOneBrain = function(multiInterface) {
  return findFirstNeeoBrain(multiInterface);
};
