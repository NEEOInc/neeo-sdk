import * as Models from '../../models';
export declare function start(conf: {
    brain: Models.BrainModel | string;
    brainport?: number;
    adapterName: string;
    baseUrl: string;
}): Promise<any>;
export declare function stop(conf: {
    brain: Models.BrainModel | string;
    adapterName: string;
}): Promise<any>;
export declare function sendNotification(msg: Models.MessageModel, deviceId: string): Promise<any>;
export declare function sendSensorNotification(msg: Models.MessageModel, deviceId: string): Promise<any>;
export declare function getSubscriptions(deviceId: string): Promise<any>;
