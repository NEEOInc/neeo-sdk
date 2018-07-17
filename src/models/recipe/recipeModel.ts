import { RecipeDefinition } from './recipeDefinition';
import { RecipeActionsModel } from './recipeActionsModel';

export interface RecipeModel extends RecipeDefinition {
  readonly action: RecipeActionsModel;
}
