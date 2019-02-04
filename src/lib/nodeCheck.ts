import * as Debug from 'debug';
import { coerce, satisfies } from 'semver';

const debug = Debug('neeo:nodecheck');

const NODE_VERSION_REQUIREMENT = '>=6.0';

export function checkNodeVersion(nodeVersion = process.versions.node) {
  const invalid = !satisfies(coerce(nodeVersion)!, NODE_VERSION_REQUIREMENT);
  debug('check if current node runtime is invalid:', invalid);
  if (!invalid) {
    return;
  }
  debug('node runtime version is invalid');
  throw new Error(
    'You must run the NEEO SDK on node >= 6.0. Your current node version is ' + nodeVersion + '.'
  );
}
