import axios from 'axios';
import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import buildBrainUrl from '../device/brain/urlBuilder';
import * as Models from '../models';
import * as factory from './factory';

const debug = Debug('neeo:recipe:recipe');
const BASE_URL_GETRECIPES = '/v1/api/recipes';
const BASE_URL_GETACTIVERECIPES = '/v1/api/activeRecipes';
const REST_OPTIONS = { timeout: 8000 };

export {
  getRecipesPowerState,
  getActiveRecipes,
  getRecipes,
};

/**
 * **Deprecated:** For backwards compatibility only, use `getActiveRecipes()` instead.
 * @deprecated
 * @function
 * @param {Object|String} NEEOBrain to connect or an IP/hostname to connect
 * @return {Promise} promise contains an array with powerKey's of the powered on recipes.
 * @example
 * neeoapi.getRecipesPowerState(brain)
 * .then((poweredOnKeys) => {
 *   console.log('- Power state fetched, powered on recipes:', poweredOnKeys);
 * })
 */
const getRecipesPowerState = getActiveRecipes;

/**
 * Get all powered on recipes of a NEEO Brain
 * @function
 * @param {Object|String} NEEOBrain to connect or an IP/hostname to connect
 * @return {Promise} promise contains an array with powerKey's of the powered on recipes.
 * @example
 * neeoapi.getRecipesPowerState(brain)
 * .then((poweredOnKeys) => {
 *   console.log('- Power state fetched, powered on recipes:', poweredOnKeys);
 * })
 */
function getActiveRecipes(brain: Models.BrainModel | string) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = buildBrainUrl(brain, BASE_URL_GETACTIVERECIPES);
  debug('GET getActiveRecipes %s', url);
  return axios.get<string[]>(url, REST_OPTIONS).then((response) => {
    if (factory.validateActiveRecipesAnswer(response.data)) {
      return response.data;
    }
    debug('invalid answer %o', response.data);
    return [];
  });
}

/**
 * Get all existing recipes of a NEEO Brain
 * @function
 * @see {@link Recipe}
 * @param {Object|String} NEEOBrain to connect or an IP/hostname to connect
 * @return {promise} promise contains an array of all recipes of the selected NEEO Brain.
 */
function getRecipes(brain: Models.BrainModel | string) {
  if (!brain) {
    return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
  }
  const url = buildBrainUrl(brain, BASE_URL_GETRECIPES);
  debug('GET AllRecipes %s', url);
  return axios
    .get<Models.RecipeDefinition[]>(url, REST_OPTIONS)
    .then(({ data: rawRecipes }) => factory.buildRecipesModel(rawRecipes));
}
