import * as bonjour from 'bonjour';
import * as Debug from 'debug';

const debug = Debug('neeo:discover:mdns');

const MDNS_NAME = 'neeo';

export type BrainServiceEntry = bonjour.Service & {
  addresses: string[];
  txt: {
    reg: string;
    rel: string;
  };
};

export default function(address?: string) {
  return new Promise<BrainServiceEntry>((resolve, reject) => {
    bonjour({ interface: address })
      .findOne({ type: MDNS_NAME }, service => {
        if (!service || !service.txt) {
          debug('invalid entry ignored');
          return reject(new Error('INVALID_SERVICE_FOUND'));
        }
        debug('found a NEEO Brain: [%s]', service.name);
        resolve(service as BrainServiceEntry);
      })
      .start();
  });
}
