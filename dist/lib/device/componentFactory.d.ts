import * as Models from '../models';
export declare const SENSOR_TYPE_ARRAY = "array";
export declare const SENSOR_TYPE_BINARY = "binary";
export declare const SENSOR_TYPE_CUSTOM = "custom";
export declare const SENSOR_TYPE_POWER = "power";
export declare const SENSOR_TYPE_RANGE = "range";
export declare const SENSOR_TYPE_STRING = "string";
export declare function buildButton(pathPrefix: string, param: Models.ButtonDescriptor): {
    type: string;
    name: string;
    label: string;
    path: string;
};
export declare function buildDirectory(pathPrefix: string, param: Models.Directory.Descriptor): {
    type: string;
    label: string;
    name: string;
    path: string;
    role: string | undefined;
    identifier: string | undefined;
};
export declare function buildSwitch(pathPrefix: string, param: Models.Descriptor): {
    type: string;
    name: string;
    label: string;
    path: string;
    sensor: string;
};
export declare function buildSensor(pathPrefix: string, param: Models.Sensor.Descriptor): {
    type: string;
    name: string;
    label: string;
    path: string;
    sensor: {
        range: any[];
        unit: string;
        type: string;
    } | {
        type: string;
    };
};
export declare function buildRangeSlider(pathPrefix: string, param: Models.Slider.Descriptor): {
    type: string;
    name: string;
    label: string;
    path: string;
    slider: {
        type: string;
        sensor: string;
        range: any[];
        unit: string;
    };
};
export declare function buildTextLabel(pathPrefix: string, param: Models.TextLabel.Descriptor): {
    type: string;
    name: string;
    label: string;
    path: string;
    sensor: string;
    isLabelVisible: boolean | undefined;
};
export declare function buildImageUrl(pathPrefix: string, param: Models.Image.Descriptor): {
    type: string;
    name: string;
    label: string;
    imageUri: string | null;
    size: "small" | "large";
    path: string;
    sensor: string;
};
export declare function buildDiscovery(pathPrefix: string): {
    type: string;
    name: string;
    path: string;
};
export declare function buildRegister(pathPrefix: string): {
    type: string;
    name: string;
    path: string;
};
export declare function buildDeviceSubscription(pathPrefix: string): {
    type: string;
    name: string;
    path: string;
};
export declare function buildFavoritesHandler(pathPrefix: string): {
    type: string;
    name: string;
    path: string;
};
