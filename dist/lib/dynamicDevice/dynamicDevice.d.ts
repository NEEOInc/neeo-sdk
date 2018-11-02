import { Component } from '../models';
import * as COMPONENTS from './components';
export { COMPONENTS };
export declare function registerHandler(inputRequestHandler: any): void;
export declare function storeDataInRequest(req: any, adapterName: string, component: Component): void;
export declare function storeDiscoveryHandlerInRequest(req: any): any;
export declare function validateDeviceIdRoute(req: any): boolean | undefined;
