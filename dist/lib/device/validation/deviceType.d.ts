import { DeviceTypes } from '../../models/deviceTypes';
export declare function needsInputCommand(type: DeviceTypes): boolean;
export declare function doesNotSupportTiming(type: DeviceTypes): boolean;
export declare function getDeviceType(type: string): DeviceTypes;
