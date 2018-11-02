import { Router } from 'express-serve-static-core';
import { RequestHandler } from '../../device/handler';
export declare function registerHandler(handler: RequestHandler): void;
declare const router: Router;
export default router;
