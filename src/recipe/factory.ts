import axios from 'axios';
import * as Debug from 'debug';
import * as Models from '../models';

const debug = Debug('neeo:recipe:recipefactory');
const REST_OPTIONS = { timeout: 8000 };

const getData = <T>(url: string) => {
  debug('GET URL %s', url);
  return axios.get<T>(url, REST_OPTIONS).then(({ data }) => {
    debug('action response: %o', data);
    return data;
  });
};

const buildFunction = <T>(url: string) => () => getData<T>(url);

const buildGetPowerStateFunction = (url: string) => () =>
  getData<{ active: boolean }>(url).then(data => {
    return data && data.active;
  });

export default function(rawRecipes: ReadonlyArray<Models.RecipeDefinition>) {
  if (!rawRecipes || !Array.isArray(rawRecipes)) {
    return [];
  }
  return rawRecipes
    .filter(recipe => recipe && recipe.detail && recipe.url)
    .map<Models.RecipeModel>(recipe => {
      const {
        url: { identify, setPowerOff, setPowerOn, getPowerState }
      } = recipe;
      return {
        ...recipe,
        action: {
          identify: buildFunction(identify),
          powerOn: buildFunction(setPowerOn),
          getPowerState: buildGetPowerStateFunction(getPowerState),
          powerOff: setPowerOff ? buildFunction(setPowerOff) : undefined
        }
      };
    });
}
