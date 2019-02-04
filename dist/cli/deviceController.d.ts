export declare function stopDevices(): void;
export interface SdkOptions {
    brainHost?: string;
    brainPort?: number;
    serverPort?: number;
    serverName?: string;
}
export declare function startDevices(options?: SdkOptions): Promise<void>;
