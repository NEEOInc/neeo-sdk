import * as Debug from 'debug';
import * as COMPONENTS from './components';

export { COMPONENTS };

const debug = Debug('neeo:dynamicdevice:dynamicdevice');

const REQUEST_DTO_DYNAMICADAPTER = 'dynamicAdapter';

let requestHandler;

export function registerHandler(inputRequestHandler) {
  requestHandler = inputRequestHandler;
}

export function storeDataInRequest(req: any, adapterName: string, component: any) {
  // dynamic device, handler not found yet
  req[REQUEST_DTO_DYNAMICADAPTER] = {
    adapterName,
    component,
  };
}

export function storeDiscoveryHandlerInRequest(req: any) {
  const dynamicAdapter = req[REQUEST_DTO_DYNAMICADAPTER];
  debug('dynamically fetch handler %s: %o', req.deviceid, dynamicAdapter);
  let handler = requestHandler.getDiscoveredDeviceComponentHandler(
    req.deviceid,
    dynamicAdapter.component
  );
  if (handler) {
    req.handler = handler;
    return Promise.resolve(handler);
  }
  return askDeviceDiscoverForDeviceInstance(req).then(() => {
    handler = requestHandler.getDiscoveredDeviceComponentHandler(
      req.deviceid,
      dynamicAdapter.component
    );
    req.handler = handler;
    return handler;
  });
}

function askDeviceDiscoverForDeviceInstance(req: any) {
  debug('askDeviceDiscoverForDeviceInstance', req.deviceid);
  const handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_DISCOVER_COMPONENT);
  if (!handler) {
    debug('NO_DISCOVER_COMPONENT_FOUND');
    return Promise.reject(new Error('NO_DISCOVER_COMPONENT_FOUND'));
  }
  return requestHandler.discover(handler, req.deviceid);
}

export function validateDeviceIdRoute(req: any) {
  if (!req.deviceid) {
    debug('MISSING_DEVICEID');
    return false;
  }
  if (req.handler) {
    return true;
  }
  const dynamicAdapter = req[REQUEST_DTO_DYNAMICADAPTER];
  if (dynamicAdapter) {
    return true;
  }
  debug('dynamicAdapter not found');

  return false;
}
