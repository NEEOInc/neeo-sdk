export interface CapabilityHandler {
  readonly componentType: string;
  readonly controller: Function | { getter: Function; setter?: Function };
}
