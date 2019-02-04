import { DeviceType } from '../deviceType';

export interface RecipeDetail {
  devicename: string;
  roomname: string;
  model: string;
  manufacturer: string;
  devicetype: DeviceType;
}
