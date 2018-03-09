'use strict';

const express = require('express');
const router = express.Router();
const debug = require('debug')('neeo:driver:express:route:DeviceRoute');

let requestHandler;

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

router.get('/:adapterid/discover', function(req, res, next) {
  debug('discover request');
  const handler = req.adapter.handler.get('discover');
  requestHandler.discover(handler)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
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
    .catch((error) => {
      next(error);
    });
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
    .catch((error) => {
      next(error);
    });
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
