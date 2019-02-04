import * as BluePromise from 'bluebird';
import * as Debug from 'debug';

type FavoriteHandler = (deviceId: string, favoriteId: string) => void | PromiseLike<void>;
const debug = Debug('neeo:device:handler:favorite');

const SUCCESS = { success: true };

export {
  execute,
};

function execute(handler: FavoriteHandler, deviceId: string, params) {
  debug('execute %s on %s device', params.favoriteId, deviceId);
  return BluePromise.resolve(handler(deviceId, params.favoriteId))
    .then(() => SUCCESS);
}
