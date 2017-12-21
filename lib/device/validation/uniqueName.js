'use strict';

const crypto = require('crypto');
const os = require('os');

const HOSTNAME = os.hostname();

module.exports = function(string, _uniqueString) {
  const uniqueString = _uniqueString || HOSTNAME;
  return crypto
    .createHash('sha1')
    .update(uniqueString + string, 'utf8')
    .digest('hex');
};
