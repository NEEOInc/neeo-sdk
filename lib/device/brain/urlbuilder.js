'use strict';

const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';

module.exports.buildBrainUrl = function(brain, baseUrl) {
  if (!brain){
    throw new Error('URLBUILDER_MISSING_PARAMETER_BRAIN');
  }
  if (!baseUrl){
    baseUrl='';
  }
  if (brain.host && brain.port) {
    return PROTOCOL + brain.host + ':' + brain.port + baseUrl;
  }
  if (typeof brain === 'string'){
    return PROTOCOL + brain + ':' + DEFAULT_BRAIN_PORT + baseUrl;
  }
  throw new Error('URLBUILDER_INVALID_PARAMETER_BRAIN');
};
