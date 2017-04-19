'use strict';

const debug = require('debug')('neeo:device:brain:BrainNotification');
const axios = require('axios');
const http = require('http');
const httpAgent = new http.Agent({ maxSockets: 1, keepAlive: true, keepAliveMsecs: 16000 });

const NeeoNotification = module.exports = function(options) {
  debug('init', options);
  this.queueSize = 0;
  this.maxQueueSize = 20;
  this.brainUri = options.url + '/v1/notifications';
};

NeeoNotification.prototype._decreaseQueueSize = function() {
  if (this.queueSize > 0) {
    this.queueSize--;
  }
};

NeeoNotification.prototype.send = function (msg) {
  if (!msg) {
    debug('empty notification ignored');
    return;
  }
  if (this.queueSize >= this.maxQueueSize) {
    debug('MAX_QUEUESIZE_REACHED', this.maxQueueSize);
    return;
  }
  debug('sending: %o', msg, this.brainUri);
  this.queueSize++;

  return axios.post(this.brainUri, msg, { httpAgent })
    .then((response) => {
      this._decreaseQueueSize();
      return response.data;
    })
    .catch((error) => {
      debug('failed to send notification', error.message);
      this._decreaseQueueSize();
    });
};
