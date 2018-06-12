'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('../crypto');

router.get('/pubkey', (req, res, next) => {
  crypto.getPublicKey()
    .then((publickey) => res.json({ publickey }))
    .catch(next);
});

module.exports = router;
