'use strict';

const axios = require('axios');
const BluePromise = require('bluebird');
const debug = require('debug')('neeo:recipe:recipe');
const factory = require('./factory');

const BASE_URL_GETRECIPES = '/v1/api/recipes';
const BASE_URL_GETACTIVERECIPES = '/v1/api/activeRecipes';
const DEFAULT_BRAIN_PORT = 3000;
const PROTOCOL = 'http://';

function buildBrainUrl(brain, baseUrl) {
  if (brain.host && brain.port) {
    return PROTOCOL + brain.host + ':' + brain.port + baseUrl;
  }
  return PROTOCOL + brain + ':' + DEFAULT_BRAIN_PORT + baseUrl;
}

module.exports.getAllRecipes = function(brain) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = buildBrainUrl(brain, BASE_URL_GETRECIPES);
  debug('getAllRecipes %s', url);
  return axios.get(url)
    .then((response) => {
      return factory.buildRecipesModel(response.data);
    });
};

module.exports.getRecipePowerState = function(brain) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = buildBrainUrl(brain, BASE_URL_GETACTIVERECIPES);
  debug('getRecipePowerState %s', url);
  return axios.get(url)
    .then((response) => {
      if (factory.validatePowerStateAnswer(response.data)) {
        return response.data;
      }
      debug('invalid answer %o', response.data);
      return [];
    });
};
