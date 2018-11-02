export interface BrainModel {
    readonly name: string;
    readonly host: string;
    readonly port: number;
    readonly version?: string;
    readonly region?: string;
    readonly iparray?: ReadonlyArray<string>;
}
