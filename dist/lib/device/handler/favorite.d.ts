declare type FavoriteHandler = (deviceId: string, favoriteId: string) => void | PromiseLike<void>;
export { execute, };
declare function execute(handler: FavoriteHandler, deviceId: string, params: any): any;
