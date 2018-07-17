import { DeviceTypes } from '../deviceTypes';

export interface RecipeDetail {
  devicename: string;
  roomname: string;
  model: string;
  manufacturer: string;
  devicetype: DeviceTypes;
}
