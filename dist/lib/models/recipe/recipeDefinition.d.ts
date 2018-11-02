import { RecipeDetail } from './recipeDetail';
import { RecipeUrlModel } from './recipeUrlModel';
export interface RecipeDefinition {
    readonly isCustom: boolean;
    readonly isPoweredOn: boolean;
    readonly uid: string;
    readonly powerKey: string;
    readonly type: string | 'launch';
    readonly url: RecipeUrlModel;
    readonly detail: RecipeDetail;
}
