import { RecipeActionsModel } from './recipeActionsModel';
import { RecipeDefinition } from './recipeDefinition';

export interface RecipeModel extends RecipeDefinition {
  readonly action: RecipeActionsModel;
}
