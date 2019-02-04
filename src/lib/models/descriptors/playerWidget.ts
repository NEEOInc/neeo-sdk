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

export const playerVolumeDefinition = {
  name: 'VOLUME',
  unit: '%',
  range: [0, 100],
};
export const coverArtDefinition = {
  name: 'COVER_ART_SENSOR',
  type: 'string',
};
export const titleDefinition = {
  name: 'TITLE_SENSOR',
  type: 'string',
};
export const descriptionDefinition = {
  name: 'DESCRIPTION_SENSOR',
  type: 'string',
};
export const playingDefinition = {
  name: 'PLAYING',
};
export const muteDefinition = {
  name: 'MUTE',
};
export const shuffleDefinition = {
  name: 'SHUFFLE',
};
export const repeatDefinition = {
  name: 'REPEAT',
};

export const playerButtonNames: string[] = [
  'PLAY',
  'PLAY TOGGLE',
  'PAUSE',
  'VOLUME UP',
  'VOLUME DOWN',
  'MUTE TOGGLE',
  'NEXT TRACK',
  'PREVIOUS TRACK',
  'SHUFFLE TOGGLE',
  'REPEAT TOGGLE',
  'CLEAR QUEUE',
];
