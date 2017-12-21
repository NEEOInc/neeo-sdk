'use strict';

const axios = require('axios');
const BluePromise = require('bluebird');
const debug = require('debug')('neeo:recipe:recipe');
const factory = require('./factory');
const urlbuilder = require('../device/brain/urlbuilder.js');

const BASE_URL_GETRECIPES = '/v1/api/recipes';
const BASE_URL_GETACTIVERECIPES = '/v1/api/activeRecipes';
const REST_OPTIONS = { timeout: 8000 };

module.exports.getAllRecipes = function(brain) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = urlbuilder.buildBrainUrl(brain, BASE_URL_GETRECIPES);
  debug('GET AllRecipes %s', url);
  return axios.get(url, REST_OPTIONS)
    .then((response) => {
      return factory.buildRecipesModel(response.data);
    });
};

module.exports.getRecipePowerState = function(brain) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = urlbuilder.buildBrainUrl(brain, BASE_URL_GETACTIVERECIPES);
  debug('GET RecipePowerState %s', url);
  return axios.get(url, REST_OPTIONS)
    .then((response) => {
      if (factory.validatePowerStateAnswer(response.data)) {
        return response.data;
      }
      debug('invalid answer %o', response.data);
      return [];
    });
};
