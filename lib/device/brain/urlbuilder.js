'use strict';

const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';

module.exports.buildBrainUrl = function(brain, baseUrl) {
  if (!baseUrl){baseUrl='';};
  if (brain.host && brain.port) {
    return PROTOCOL + brain.host + ':' + brain.port + baseUrl;
  };
  return PROTOCOL + brain + ':' + DEFAULT_BRAIN_PORT + baseUrl;
};