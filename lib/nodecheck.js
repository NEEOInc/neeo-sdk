'use strict';

const debug = require('debug')('neeo:nodecheck');
const { coerce, satisfies } = require('semver');

module.exports.checkNodeVersion = function(nodeVersion = process.versions.node) {
  const nodeVersionInvalid = !satisfies(coerce(nodeVersion), '>=6.0');
  debug('check if current node runtime is invalid:', nodeVersionInvalid);
  if (nodeVersionInvalid) {
    debug('node runtime version is invalid');
    throw new Error('You must run the NEEO SDK on node >= 6.0. Your current node version is ' + nodeVersion + '.');
  }
};
