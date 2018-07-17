export interface RecipeActionsModel {
  readonly identify: () => Promise<any>;
  readonly powerOn: () => Promise<any>;
  readonly getPowerState: () => Promise<boolean>;
  powerOff?: () => Promise<any>;
}
