import { StopServerConfig } from '..';
import { RequestHandler } from '../device/handler';
import { startExpress, stopExpress } from './server';

export interface ExpressBrainDriver {
  start(conf: { ip?: string; port?: number }, handler: RequestHandler): Promise<void>;

  stop(conf: StopServerConfig): Promise<void>;
}

export default {
  start: startExpress,
  stop: stopExpress,
} as ExpressBrainDriver;
