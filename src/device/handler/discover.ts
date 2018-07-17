import * as Debug from 'debug';
import * as Models from '../../models';

const debug = Debug('neeo:device:express:route:handler:discover');

const isValidItem = (item: Models.DiscoveryResult) =>
  !!item &&
  typeof item === 'object' &&
  !Array.isArray(item) &&
  'id' in item &&
  'name' in item;

export function run(handler: Models.DiscoveryResult.Controller) {
  return Promise.resolve(handler()).then(result => {
    if (!Array.isArray(result) || !result.every(isValidItem)) {
      debug('Discovery result invalid, not an array');
      return Promise.reject<ReadonlyArray<Models.DiscoveryResult>>(
        new Error('INVALID_DISCOVERY_ANSWER')
      );
    }
    const ids = result.reduce((set, { id }) => set.add(id), new Set());
    if (ids.size !== result.length) {
      debug('Discovery result invalid, duplicate device ids');
      return Promise.reject<ReadonlyArray<Models.DiscoveryResult>>(
        new Error('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS')
      );
    }
    return result;
  });
}
