import * as Models from '../models';
export { buildDeviceCapabilities, };
declare function buildDeviceCapabilities(deviceBuilder: Models.DeviceBuilder): {
    capabilities: any[];
    handlers: Map<string, Models.CapabilityHandler>;
};
