'use strict';

const express = require('express');
const router = express.Router();
const debug = require('debug')('neeo:driver:express:route:DeviceRegistration');

router.get('/:adapterName/subscribe/:deviceId/:eventUriPrefix', function(req, res) {
  const deviceId = req.params.deviceId;
  const eventUriPrefix = req.params.eventUriPrefix;
  debug('NOT IMPLEMENTED: subscribe to %o', { deviceId, eventUriPrefix });
  res.json({ success: true });
/*  req.adapter.subscribe(deviceId, eventUriPrefix)
  .then(() => {
    res.json({success: true});
  })
  .catch(err => {
    log.warn('SUBSCRIBE_FAILED', err.message);
    next(err);
  });*/
});

router.get('/:adapterName/unsubscribe/:deviceId', function(req, res) {
  const deviceId = req.params.deviceId;
  debug('NOT IMPLEMENTED: unsubscribe %o', { deviceId });
  res.json({ success: true });
/*  req.adapter.unsubscribe(deviceId)
  .then(() => {
    res.json({success: true});
  })
  .catch(err => {
    log.warn('UNSUBSCRIBE_FAILED', err.message);
    next(err);
  });*/
});

module.exports = router;
