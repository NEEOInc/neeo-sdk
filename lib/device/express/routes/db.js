'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../index');

router.get('/search', function (req, res) {
  const query = req.query.q;
  if(query && query.length) {
    res.json(db.searchDevice(query));
  } else {
    res.json([]);
  }
});

router.get('/:device_id', function(req, res) {
  /*jshint sub:true*/
  const id = req.params['device_id'];
  res.json(db.getDevice(id));
});

module.exports = router;
