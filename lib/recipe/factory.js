'use strict';

const axios = require('axios');
const debug = require('debug')('neeo:recipe:recipefactory');

const REST_OPTIONS = { timeout: 8000 };

/**
 * @function
 * @module Recipe
 * @description The Recipe module allows to interact with Recipe on the NEEO Brain. A Recipe contains details about the Recipe and expose functions
 * to change the state of the Recipes (power on and power off).
 * @example
 *  {
 *    type: 'launch',
 *    detail:
 *     { devicename: 'TV',
 *       roomname: 'Living%20Room',
 *       model: '42PFL9703',
 *       manufacturer: 'Philips',
 *       devicetype: 'TV' },
 *    url:
 *     { identify: 'http://192.168.1.33:3000/v1/systeminfo/identbrain',
 *       setPowerOn: 'http://192.168.1.33:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602382016512/execute',
 *       setPowerOff: 'http://192.168.1.33:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602394599424/execute',
 *       getPowerState: 'http://192.168.1.33:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602382016512/isactive' },
 *    isCustom: false,
 *    isPoweredOn: false,
 *    uid: '6223454581767012352',
 *    powerKey: '6223454602377822208',
 *    action:
 *     { identify: [Function],
 *       powerOn: [Function],
 *       getPowerState: [Function],
 *       powerOff: [Function] }
 * }
 */

/**
 * @function identify
 * @description Identify the NEEO Brain which this recipe is stored. The user led of the NEEO Brain will blink.
 * **Important**: call "recipe.action.identify()"!
 * @return {object} success value indicate if call was successful or not
 * @example {"success":true}
 */

/**
 * @function powerOn
 * @description Launch this Recipe.
 * **Important**: call "recipe.action.powerOn()"!
 * @return {object} describe how long it take to power on the Recipe
 * @example {"estimatedDuration":2000,"startTime":1485452774719,"error":null,"steps":[{"duration":2000,"text":"Sending POWER ON to TV"}]}
 */

/**
 * @function powerOff
 * @description PowerOff this Recipe. Hint: this function is not available for custom (User build) recipes.
 * **Important**: call "recipe.action.powerOff()"!
 * @return {object} describe how long it take to power off the Recipe
 * @example {"estimatedDuration":2000,"startTime":1485452999763,"error":null,"steps":[]}
 */

/**
 * @function getPowerState
 * @return {boolean}
 * @description Get the power state of this Recipe.
 * **Important**: call "recipe.action.getPowerState()"!
 */

/** */ // avoid doxdox thinking the @module above is for this function.
function buildFunction(url) {
  return () => {
    debug('GET URL %s', url);
    return axios.get(url, REST_OPTIONS)
      .then((response) => {
        debug('action response: %o', response.data);
        return response.data;
      });
  };
}

function buildGetPowerStateFunction(url) {
  return () => {
    debug('GET powerstate %s', url);
    return axios.get(url, REST_OPTIONS)
      .then((response) => {
        debug('action response: %o', response.data);
        if (response.data && response.data.active) {
          return response.data.active;
        }
        return false;
      });
  };
}

function buildRecipesModel(rawRecipes) {
  if (!rawRecipes || !Array.isArray(rawRecipes)) {
    return [];
  }
  return rawRecipes
    .filter((recipe) => {
      return recipe && recipe.detail && recipe.url;
    })
    .map((recipe) => {
      const action = {
        identify: buildFunction(recipe.url.identify),
        powerOn: buildFunction(recipe.url.setPowerOn),
        getPowerState: buildGetPowerStateFunction(recipe.url.getPowerState)
      };
      if (recipe.url.setPowerOff) {
        action.powerOff = buildFunction(recipe.url.setPowerOff);
      }
      recipe.action = action;
      return recipe;
    });
}

function validatePowerStateAnswer(answer) {
  if (!answer || !Array.isArray(answer)) {
    return false;
  }
  return true;
}

module.exports.buildRecipesModel = buildRecipesModel;
module.exports.validatePowerStateAnswer = validatePowerStateAnswer;
