import * as Models from '../../models';
export default class implements Models.PromiseCache {
    private readonly cacheDurationMs;
    private readonly uniqueIdentifier;
    private promise?;
    private cacheExpire;
    constructor(cacheDurationMs?: number, uniqueIdentifier?: string);
    getValue(getPromiseFunction?: () => Promise<any>): Promise<any>;
    invalidate(): void;
}
