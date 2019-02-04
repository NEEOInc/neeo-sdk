import * as Models from '../models';
export { getRecipesPowerState, getActiveRecipes, getRecipes, };
declare const getRecipesPowerState: typeof getActiveRecipes;
declare function getActiveRecipes(brain: Models.BrainModel | string): any;
declare function getRecipes(brain: Models.BrainModel | string): any;
