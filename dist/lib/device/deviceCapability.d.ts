import * as Models from '../models';
export default function (deviceBuilder: Models.DeviceBuilder): {
    capabilities: Models.Component[];
    handlers: Map<string, Models.CapabilityHandler>;
};
