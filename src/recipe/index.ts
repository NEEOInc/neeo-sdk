import axios from 'axios';
import * as Debug from 'debug';
import buildRecipeModels from './factory';
import buildBrainUrl from '../device/brain/urlBuilder';
import * as Models from '../models';

const debug = Debug('neeo:recipe:recipe');
const BASE_URL_GETRECIPES = '/v1/api/recipes';
const BASE_URL_GETACTIVERECIPES = '/v1/api/activeRecipes';
const REST_OPTIONS = { timeout: 8000 };

/**
 * Return a promise to a list of the power keys of all active recipes.
 * @param brain The host (as a string) or model (as an object) of the brain on the network.
 */
export function getRecipePowerState(brain: Models.BrainModel | string) {
  if (!brain) {
    return Promise.reject('MISSING_BRAIN_PARAMETER');
  }
  const url = buildBrainUrl(brain, BASE_URL_GETACTIVERECIPES);
  debug('GET RecipePowerState %s', url);
  return axios
    .get<string[]>(url, REST_OPTIONS)
    .then(({ data }) => (!!data && Array.isArray(data) ? data : []));
}

/**
 * Return a promise to a list of all recipes on the brain.
 * @param brain The host (as a string) or model (as an object) of the brain on the network.
 */
export function getAllRecipes(brain: Models.BrainModel | string) {
  if (!brain) {
    return Promise.reject('MISSING_BRAIN_PARAMETER');
  }
  const url = buildBrainUrl(brain, BASE_URL_GETRECIPES);
  debug('GET AllRecipes %s', url);
  return axios
    .get<Models.RecipeDefinition[]>(url, REST_OPTIONS)
    .then(({ data: rawRecipes }) => buildRecipeModels(rawRecipes));
}
