import { RecipeUrlModel } from './recipeUrlModel';
import { RecipeDetail } from './recipeDetail';

export interface RecipeDefinition {
  readonly isCustom: boolean;
  readonly isPoweredOn: boolean;
  readonly uid: string;
  readonly powerKey: string;
  readonly type: string | 'launch';
  readonly url: RecipeUrlModel;
  readonly detail: RecipeDetail;
}
