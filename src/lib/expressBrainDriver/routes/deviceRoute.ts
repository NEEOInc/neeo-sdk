import * as Debug from 'debug';
import * as express from 'express';
import { NextFunction, Router } from 'express-serve-static-core';
import { RequestHandler } from '../../device/handler';
import * as COMPONENTS from '../../dynamicDevice/components';
import * as dynamicDevice from '../../dynamicDevice/dynamicDevice';
import * as Models from '../../models';

declare module 'express-serve-static-core' {
  export interface Request {
    adapter: Models.DeviceAdapterModel;
    handler: Models.CapabilityHandler;
    deviceId: string;
    deviceid: string;
    value: any;
  }
}

const debug = Debug('neeo:driver:express:route:DeviceRoute');

let requestHandler: RequestHandler;
export function registerHandler(handler: RequestHandler) {
  dynamicDevice.registerHandler(handler);
  requestHandler = handler;
}

const router: Router = express.Router();

router.param('adapterid', (req, res, next, adapterid) => {
  return requestHandler
    .getDeviceByAdapterId(adapterid)
    .then((adapter) => {
      req.adapter = adapter;
      next();
    })
    .catch(next);
});

router.param('component', (req, res, next, component) => {
  const handler = req.adapter.handler.get(component);
  if (handler) {
    debug('using static handler for component:', component);
    req.handler = handler;
    return next();
  }

  const adapterName = req.adapter.adapterName;
  if (!adapterName) {
    errorHandler(`COMPONENT_HANDLER_NOT_FOUND ${adapterName}:${component}`, next);
    return;
  }

  debug('dynamic device needed for component:', component);
  dynamicDevice.storeDataInRequest(req, adapterName, component);
  next();
});

// here we might need to fetch a dynamic device from the request handler
router.param('deviceid', (req, res, next, deviceid) => {
  req.deviceid = deviceid;
  const validParameters = dynamicDevice.validateDeviceIdRoute(req);
  if (!validParameters) {
    return errorHandler('DEVICEID_ROUTE_INVALID_PARAMETERS', next);
  }
  const isStaticDevice = req.handler;
  if (isStaticDevice) {
    return next();
  }

  dynamicDevice
    .storeDiscoveryHandlerInRequest(req)
    .then((dynamicRegisteredDeviceHandler) => {
      if (dynamicRegisteredDeviceHandler) {
        return next();
      }
      debug('device not found with deviceId', deviceid);
      return errorHandler('DYNAMIC_REGISTERED_DEVICEID_NOT_FOUND', next);
    })
    .catch((error) => {
      errorHandler(error.message, next);
    });
});

router.param('value', (req, res, next, value) => {
  if (typeof value === 'undefined' || value === null) {
    return errorHandler('VALUE_NOT_DEFINED', next);
  }
  req.value = value;
  next();
});

router.get('/:adapterid/registered', (req, res, next) => {
  debug('get registered request');
  const handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_REGISTER_COMPONENT);
  requestHandler
    .isRegistered(handler)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/:adapterid/register', (req, res, next) => {
  debug('post register request');
  const credentials = req.body;
  const handler = req.adapter.handler.get(
    COMPONENTS.NEEO_SDK_REGISTER_COMPONENT
  ) as Models.CapabilityHandler;
  requestHandler
    .register(handler, credentials)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:adapterid/discover', (req, res, next) => {
  debug('discover request');
  const handler = req.adapter.handler.get(
    COMPONENTS.NEEO_SDK_DISCOVER_COMPONENT
  ) as Models.CapabilityHandler;
  requestHandler
    .discover(handler)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:adapterid/subscribe/:deviceId/:eventUriPrefix', (req, res, next) => {
  const deviceId = req.params.deviceId;
  const handler = req.adapter.handler.get(
    COMPONENTS.NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT
  ) as Models.CapabilityHandler;
  requestHandler
    .subscribe(handler, deviceId)
    .then(() => res.json({ success: true }))
    .catch(next);
});

router.get('/:adapterid/unsubscribe/:deviceId', (req, res, next) => {
  const deviceId = req.params.deviceId;
  const handler = req.adapter.handler.get(
    COMPONENTS.NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT
  ) as Models.CapabilityHandler;
  requestHandler
    .unsubscribe(handler, deviceId)
    .then(() => res.json({ success: true }))
    .catch(next);
});

// Call Action
router.post('/:adapterid/:component/:deviceid/action', (req, res, next) => {
  debug('call action [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    body: req.body,
  };
  requestHandler
    .handleAction(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// GET value
router.get('/:adapterid/:component/:deviceid', (req, res, next) => {
  debug('get request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
  };
  requestHandler
    .handleGet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/:adapterid/:component/:deviceid', (req, res, next) => {
  debug('post request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    body: req.body,
  };
  requestHandler
    .handleGet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// SET value
router.get('/:adapterid/:component/:deviceid/:value', (req, res, next) => {
  debug('set request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    value: req.value,
  };
  requestHandler
    .handleSet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

function errorHandler(message: string, next: NextFunction) {
  debug('error handler %o', message);
  const err = new Error(message);
  Object.assign(err, { status: 404 });
  next(err);
}

export default router;
