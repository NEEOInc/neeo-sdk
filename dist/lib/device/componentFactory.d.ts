import * as Models from '../models';
export declare const SENSOR_TYPE_ARRAY = "array";
export declare const SENSOR_TYPE_BINARY = "binary";
export declare const SENSOR_TYPE_CUSTOM = "custom";
export declare const SENSOR_TYPE_POWER = "power";
export declare const SENSOR_TYPE_RANGE = "range";
export declare const SENSOR_TYPE_STRING = "string";
export declare function buildButton(pathPrefix: string, param: Models.ButtonDescriptor): Models.UIComponent;
export declare function buildDirectory(pathPrefix: string, param: Models.DirectoryDescriptor): Models.DirectoryComponent;
export declare function buildSwitch(pathPrefix: string, param: Models.SwitchDescriptor): Models.SensorComponent;
export declare function buildSensor(pathPrefix: string, param: Models.SensorDescriptor): Models.SensorComponent;
export declare function buildRangeSlider(pathPrefix: string, param: Models.SliderDescriptor): Models.SliderComponent;
export declare function buildTextLabel(pathPrefix: string, param: Models.TextLabelDescriptor): Models.SensorComponent & {
    isLabelVisible: boolean | undefined;
};
export declare function buildImageUrl(pathPrefix: string, param: Models.ImageDescriptor): Models.ImageComponent;
export declare function buildDiscovery(pathPrefix: string): Models.DiscoveryComponent;
export declare function buildRegister(pathPrefix: string): Models.RegistrationComponent;
export declare function buildDeviceSubscription(pathPrefix: string): Models.SubscriptionComponent;
