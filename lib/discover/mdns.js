'use strict';

const bonjour = require('bonjour')();
const debug = require('debug')('neeo:discover:mdns');
const BluePromise = require('bluebird');

const MDNS_NAME = 'neeo';

//TODO add timeout
function findFirstNeeoBrain() {
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

    const mdnsBrowser = bonjour.findOne({ type: MDNS_NAME }, serviceUpListener);
    mdnsBrowser.start();
  });
}

module.exports.findFirstNeeoBrain = findFirstNeeoBrain;
