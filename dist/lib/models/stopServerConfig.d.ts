import { BrainModel } from './brainModel';
export interface StopServerConfig {
    name: string;
    brain: string | BrainModel;
    baseurl?: string;
}
