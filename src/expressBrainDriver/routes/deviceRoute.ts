import * as Debug from 'debug';
import * as express from 'express';
import { Router, NextFunction } from 'express-serve-static-core';
import { RequestHandler } from '../../device/handler';
import * as Models from '../../models';

declare module 'express-serve-static-core' {
  export interface Request {
    adapter: Models.DeviceAdapterModel;
    handler: Models.CapabilityHandler;
    deviceId: string;
    value: any;
  }
}

const debug = Debug('neeo:driver:express:route:DeviceRoute');

const NEEO_SDK_REGISTER_COMPONENT = 'register';
const NEEO_SDK_DISCOVER_COMPONENT = 'discover';
const NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT = 'devicesubscription';

let requestHandler: RequestHandler;
export function registerHandler(handler: RequestHandler) {
  requestHandler = handler;
}

const router: Router = express
  .Router()
  .param('adapterId', (req, res, next, adapterId) => {
    return requestHandler
      .getDeviceByAdapterId(adapterId)
      .then(adapter => {
        req.adapter = adapter;
        next();
      })
      .catch(next);
  })
  .param('component', (req, res, next, component) => {
    const handler = req.adapter.handler.get(component);
    if (!handler) {
      return errorHandler('HANDLER_NOT_FOUND', next);
    }
    req.handler = handler;
    next();
  })
  .param('deviceId', (req, res, next, deviceId) => {
    if (!deviceId) {
      return errorHandler('DEVICEID_NOT_FOUND', next);
    }
    req.deviceId = deviceId;
    next();
  })
  .param('value', (req, res, next, value) => {
    if (typeof value === 'undefined' || value === null) {
      return errorHandler('VALUE_NOT_DEFINED', next);
    }
    req.value = value;
    next();
  })
  .get('/:adapterId/registered', ({ adapter }, res, next) => {
    debug('get registered request');
    const handler = adapter.handler.get(NEEO_SDK_REGISTER_COMPONENT);
    requestHandler
      .isRegistered(handler!)
      .then(result => res.json(result))
      .catch(next);
  })
  .post('/:adapterId/register', ({ body, adapter }, res, next) => {
    debug('post register request');
    const credentials = body;
    const handler = adapter.handler.get(NEEO_SDK_REGISTER_COMPONENT);
    requestHandler
      .register(handler!, credentials)
      .then(result => res.json(result))
      .catch(next);
  })
  .get('/:adapterId/discover', ({ adapter: { handler } }, res, next) => {
    debug('discover request');
    requestHandler
      .discover(handler.get(NEEO_SDK_DISCOVER_COMPONENT) as any)
      .then(result => res.json(result))
      .catch(next);
  })
  .get(
    '/:adapterId/subscribe/:deviceId/:eventUriPrefix',
    ({ adapter, params }, res, next) => {
      const deviceId = params.deviceId;
      const handler = adapter.handler.get(
        NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT
      );
      requestHandler
        .subscribe(handler!, deviceId)
        .then(() => res.json({ success: true }))
        .catch(next);
    }
  )
  .get(
    '/:adapterId/unsubscribe/:deviceId',
    ({ params: deviceId, adapter }, res, next) => {
      const handler = adapter.handler.get(
        NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT
      );
      requestHandler
        .unsubscribe(handler!, deviceId)
        .then(() => res.json({ success: true }))
        .catch(next);
    }
  )
  // Call Action
  .post(
    '/:adapterId/:component/:deviceId/action',
    ({ handler, deviceId, params, body }, res, next) => {
      debug('call action [%o]', params);
      requestHandler
        .handleAction({
          handler,
          deviceId,
          body
        })
        .then(result => res.json(result))
        .catch(next);
    }
  )
  .get(
    '/:adapterId/:component/:deviceId',
    ({ params, handler, deviceId }, res, next) => {
      debug('get request [%o]', params);
      const model = { handler, deviceId };
      return requestHandler
        .handleGet(model)
        .then(result => res.json(result))
        .catch(next);
    }
  )
  .post(
    '/:adapterId/:component/:deviceId',
    ({ params, handler, deviceId, body }, res, next) => {
      debug('get request [%o]', params);
      const model = { handler, deviceId, body };
      return requestHandler
        .handleGet(model)
        .then(result => res.json(result))
        .catch(next);
    }
  )
  // SET value
  .get(
    '/:adapterId/:component/:deviceId/:value',
    ({ params, handler, deviceId, value }, res, next) => {
      debug('set request [%o]', params);
      const model = { handler, deviceId, value };
      return requestHandler
        .handleSet(model)
        .then(result => res.json(result))
        .catch(next);
    }
  );

function errorHandler(message: string, next: NextFunction) {
  debug('error handler %o', message);
  const err = new Error(message);
  Object.assign(err, { status: 404 });
  next(err);
}

export default router;
