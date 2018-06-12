'use strict';

const express = require('express');
const router = express.Router();
const debug = require('debug')('neeo:driver:express:route:DeviceRoute');

let requestHandler;

const NEEO_SDK_REGISTER_COMPONENT = 'register';
const NEEO_SDK_DISCOVER_COMPONENT = 'discover';
const NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT = 'devicesubscription';

router.param('adapterid', function(req, res, next, adapterid) {
  return requestHandler.getDeviceByAdapterId(adapterid)
    .then((adapter) => {
      req.adapter = adapter;
      next();
    })
    .catch(next);
});

router.param('component', function(req, res, next, component) {
  const handler = req.adapter.handler.get(component);
  if (!handler) {
    return errorHandler('HANDLER_NOT_FOUND', next);
  }
  req.handler = handler;
  next();
});

router.param('deviceid', function(req, res, next, deviceid) {
  if (!deviceid) {
    return errorHandler('DEVICEID_NOT_FOUND', next);
  }
  req.deviceid = deviceid;
  next();
});

router.param('value', function(req, res, next, value) {
  if (typeof value === 'undefined' || value === null) {
    return errorHandler('VALUE_NOT_DEFINED', next);
  }
  req.value = value;
  next();
});

router.get('/:adapterid/registered', function(req, res, next) {
  debug('get registered request');
  const handler = req.adapter.handler.get(NEEO_SDK_REGISTER_COMPONENT);
  requestHandler.isRegistered(handler)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/:adapterid/register', function(req, res, next) {
  debug('post register request');
  const credentials = req.body;
  const handler = req.adapter.handler.get(NEEO_SDK_REGISTER_COMPONENT);
  requestHandler.register(handler, credentials)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:adapterid/discover', function(req, res, next) {
  debug('discover request');
  const handler = req.adapter.handler.get(NEEO_SDK_DISCOVER_COMPONENT);
  requestHandler.discover(handler)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:adapterid/subscribe/:deviceId/:eventUriPrefix', function(req, res, next) {
  const deviceId = req.params.deviceId;
  const handler = req.adapter.handler.get(NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT);

  requestHandler.subscribe(handler, deviceId)
    .then(() => res.json({success: true}))
    .catch(next);
});

router.get('/:adapterid/unsubscribe/:deviceId', function(req, res, next) {
  const deviceId = req.params.deviceId;
  const handler = req.adapter.handler.get(NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT);

  requestHandler.unsubscribe(handler, deviceId)
    .then(() => res.json({success: true}))
    .catch(next);
});

// Call Action
router.post('/:adapterid/:component/:deviceid/action', function(req, res, next) {
  debug('call action [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    body: req.body,
  };
  requestHandler.handleAction(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// GET value
router.get('/:adapterid/:component/:deviceid', function(req, res, next) {
  debug('get request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid
  };
  requestHandler.handleGet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/:adapterid/:component/:deviceid', function(req, res, next) {
  debug('get request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    body: req.body,
  };
  requestHandler.handleGet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// SET value
router.get('/:adapterid/:component/:deviceid/:value', function(req, res, next) {
  debug('set request [%o]', req.params);
  const model = {
    handler: req.handler,
    deviceid: req.deviceid,
    value: req.value
  };
  requestHandler.handleSet(model)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

module.exports = router;

module.exports.registerHandler = function(_requestHandler) {
  requestHandler = _requestHandler;
};

function errorHandler(message, next) {
  debug('error handler %o',message);
  const err = new Error(message);
  err.status = 404;
  next(err);
}
