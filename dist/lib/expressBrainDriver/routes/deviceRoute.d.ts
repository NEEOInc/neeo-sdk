import { Router } from 'express-serve-static-core';
import { RequestHandler } from '../../device/handler';
import * as Models from '../../models';
declare module 'express-serve-static-core' {
    interface Request {
        adapter: Models.DeviceAdapterModel;
        handler: Models.CapabilityHandler;
        deviceId: string;
        deviceid: string;
        value: any;
    }
}
export declare function registerHandler(handler: RequestHandler): void;
declare const router: Router;
export default router;
