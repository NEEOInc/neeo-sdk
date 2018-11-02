import { StopServerConfig } from '..';
import { RequestHandler } from '../device/handler';
export interface ExpressBrainDriver {
    start(conf: {
        ip?: string;
        port?: number;
    }, handler: RequestHandler): Promise<void>;
    stop(conf: StopServerConfig): Promise<void>;
}
declare const _default: ExpressBrainDriver;
export default _default;
