'use strict';

const crypto = require('crypto');
const os = require('os');

const HOSTNAME = os.hostname();

module.exports = function(string, _uniqeString) {
  const uniqeString = _uniqeString || HOSTNAME;
  return crypto
    .createHash('sha1')
    .update(uniqeString + string, 'utf8')
    .digest('hex');
};
