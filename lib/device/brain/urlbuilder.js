'use strict';

const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';

module.exports.buildBrainUrl = function(brain) {
  if (brain.host && brain.port) {
    return PROTOCOL + brain.host + ':' + brain.port;
  }
  return PROTOCOL + brain + ':' + DEFAULT_BRAIN_PORT;
}