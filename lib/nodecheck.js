'use strict';

const debug = require('debug')('neeo:nodecheck');

module.exports.checkNodeVersion = function() {
  const nodeVersionInvalid = process.versions.node < '6.0';
  debug('check if current node runtime is invalid', nodeVersionInvalid);
  if (nodeVersionInvalid) {
    debug('node runtime version is invalid');
    throw new Error('You must run the NEEO SDK on node >= 6.0. Your current node version is ' + process.versions.node + '.');
  }
};
