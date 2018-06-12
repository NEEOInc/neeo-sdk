'use strict';

const { Observable } = require('rxjs');
const bonjour = require('bonjour');

const MDNS_NAME = 'neeo';

module.exports = {
  getMdnsStream,
};

function getMdnsStream(networkInterface) {
  return Observable.create((observer) => {
    bonjour({ interface: networkInterface }).find(
      { type: MDNS_NAME },
      (service) => {
        observer.next(service);
      }
    );
  });
}
