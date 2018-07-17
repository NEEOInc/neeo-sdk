import { startExpress, stopExpress } from './server';
import { RequestHandler } from '../device/handler';

export interface ExpressBrainDriver {
  start(
    conf: { ip?: string; port?: number },
    handler: RequestHandler
  ): Promise<void>;

  stop(): Promise<void>;
}

export default {
  start: startExpress,
  stop: stopExpress
} as ExpressBrainDriver;
