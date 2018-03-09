'use strict';

const BluePromise = require('bluebird');
const bonjour = require('bonjour');
const debug = require('debug')('neeo:discover:mdns');

const MDNS_NAME = 'neeo';

//TODO add timeout
function findFirstNeeoBrain(netIf) {
  debug('findFirstNeeoBrain');
  return new BluePromise((resolve, reject) => {
    function serviceUpListener(service) {
      if (!service || !service.txt) {
        debug('invalid entry ignored');
        reject(new Error('INVALID_SERVICE_FOUND'));
      }
      debug('found a NEEO Brain: [%s]', service.name);
      resolve(service);
    }
    const mdnsBrowser = bonjour({ interface: netIf }).findOne({ type: MDNS_NAME }, serviceUpListener);
    mdnsBrowser.start();
  });
}

module.exports.findFirstNeeoBrain = findFirstNeeoBrain;
