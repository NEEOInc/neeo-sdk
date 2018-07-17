import * as Debug from 'debug';
import { coerce, satisfies } from 'semver';

const debug = Debug('neeo:nodecheck');

/**
 * Ensure the SDK is run on nodeJS 6.0 and up.
 */
export default function nodeCheck(nodeVersion = process.versions.node) {
  const invalid = !satisfies(coerce(nodeVersion)!, '>=6.0');
  debug('check if current node runtime is invalid:', invalid);
  if (!invalid) {
    return;
  }
  debug('node runtime version is invalid');
  throw new Error(
    'You must run the NEEO SDK on node >= 6.0. Your current node version is ' +
      nodeVersion +
      '.'
  );
}
