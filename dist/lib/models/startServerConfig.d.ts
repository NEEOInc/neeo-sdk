import { BrainModel } from './brainModel';
import { DeviceBuilder } from './deviceBuilder';
export interface StartServerConfig {
    port: number;
    brain: BrainModel | string;
    brainport?: number;
    name: string;
    devices: ReadonlyArray<DeviceBuilder>;
    maxConnectionAttempts?: number;
    baseurl?: string;
}
