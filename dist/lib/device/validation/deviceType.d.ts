import { DeviceType } from '../../models/deviceType';
export declare function needsInputCommand(type: DeviceType): boolean;
export declare function doesNotSupportTiming(type: DeviceType): boolean;
export declare function hasFavoritesSupport(type: DeviceType): boolean;
export declare function hasPlayerSupport(type: DeviceType): boolean;
export declare function getDeviceType(type: string): DeviceType;
