export declare function registerAdapterOnTheBrain(conf: {
    url: string;
    baseUrl: string;
    adapterName: string;
}): Promise<any>;
export declare function unregisterAdapterOnTheBrain(conf: {
    url: string;
    adapterName: string;
}): Promise<any>;
