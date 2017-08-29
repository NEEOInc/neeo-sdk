'use strict';

const express = require('express');
const router = express.Router();

let requestHandler;

router.get('/search', function (req, res) {
  const query = req.query.q;
  if(query && query.length) {
    res.json(requestHandler.searchDevice(query));
  } else {
    res.json([]);
  }
});

router.get('/:device_id', function(req, res) {
  /*jshint sub:true*/
  const id = req.params['device_id'];
  res.json(requestHandler.getDevice(id));
});

module.exports = router;

module.exports.registerHandler = function(_requestHandler) {
  requestHandler = _requestHandler;
};
