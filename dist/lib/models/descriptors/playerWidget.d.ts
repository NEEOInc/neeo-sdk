import * as Directory from './directoryDescriptor';
import * as Sensor from './sensorDescriptor';
import * as Slider from './sliderDescriptor';
import * as Switch from './switchDescriptor';
export interface Controller {
    readonly rootDirectory: DirectoryHandler;
    readonly queueDirectory?: DirectoryHandler;
    readonly volumeController: Slider.Controller;
    readonly coverArtController: Sensor.Controller;
    readonly titleController: Sensor.Controller;
    readonly descriptionController: Sensor.Controller;
    readonly playingController: Switch.Controller;
    readonly muteController: Switch.Controller;
    readonly shuffleController: Switch.Controller;
    readonly repeatController: Switch.Controller;
}
export interface DirectoryHandler {
    readonly name?: string;
    readonly label?: string;
    readonly controller: Directory.Controller;
}
export declare const playerVolumeDefinition: {
    name: string;
    unit: string;
    range: number[];
};
export declare const coverArtDefinition: {
    name: string;
    type: string;
};
export declare const titleDefinition: {
    name: string;
    type: string;
};
export declare const descriptionDefinition: {
    name: string;
    type: string;
};
export declare const playingDefinition: {
    name: string;
};
export declare const muteDefinition: {
    name: string;
};
export declare const shuffleDefinition: {
    name: string;
};
export declare const repeatDefinition: {
    name: string;
};
export declare const playerButtonNames: string[];
