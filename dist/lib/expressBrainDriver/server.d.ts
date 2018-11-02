import { RequestHandler } from '../device/handler';
export declare function startExpress(conf: {
    ip?: string;
    port?: number;
}, handler: RequestHandler): Promise<void>;
export declare function stopExpress(): Promise<void>;
