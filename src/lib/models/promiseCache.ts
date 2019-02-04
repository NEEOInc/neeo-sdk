export interface PromiseCache {
  invalidate(): void;
  getValue(getPromiseFunction?: () => Promise<any>): Promise<any>;
}
