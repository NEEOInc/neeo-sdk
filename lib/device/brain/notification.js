'use strict';

const debug = require('debug')('neeo:device:brain:BrainNotification');
const axios = require('axios');
const http = require('http');
const httpAgent = new http.Agent({ maxSockets: 1, keepAlive: true, keepAliveMsecs: 16000 });

const MAXIMAL_CACHED_ENTRIES = 50;
const MAXIMAL_MESSAGE_QUEUE_SIZE = 20;
const timeout = 8000;

const NeeoNotification = module.exports = function(options) {
  debug('init', options);
  this.queueSize = 0;
  this.brainUri = options.url + '/v1/notifications';
  this.sensorValues = new Map();
};

NeeoNotification.prototype._decreaseQueueSize = function() {
  if (this.queueSize > 0) {
    this.queueSize--;
  }
};

NeeoNotification.prototype._isDuplicateMessage = function(msg) {
  if (!msg) {
    return false;
  }
  const { type, data } = msg;
  if (!type || typeof data === 'undefined') {
    return false;
  }
  const lastSensorValue = this.sensorValues.get(type);
  return (lastSensorValue === data);
};

NeeoNotification.prototype._updateCache = function(msg) {
  if (!msg) {
    return;
  }
  const { type, data } = msg;
  if (!type || typeof data === 'undefined') {
    return;
  }
  if (this.sensorValues.size > MAXIMAL_CACHED_ENTRIES) {
    debug('clear message cache');
    this.sensorValues.clear();
  }
  this.sensorValues.set(type, data);
};


NeeoNotification.prototype.send = function(msg) {
  if (!msg) {
    debug('empty notification ignored');
    return Promise.reject(new Error('EMPTY_MESSAGE'));
  }
  if (this._isDuplicateMessage(msg)) {
    debug('DUPLICATE_MESSAGE');
    return Promise.reject(new Error('DUPLICATE_MESSAGE'));
  }
  if (this.queueSize >= MAXIMAL_MESSAGE_QUEUE_SIZE) {
    debug('MAX_QUEUESIZE_REACHED', MAXIMAL_MESSAGE_QUEUE_SIZE);
    return Promise.reject(new Error('MAX_QUEUESIZE_REACHED'));
  }
  debug('POST: %o', msg, this.brainUri);
  this.queueSize++;

  return axios.post(this.brainUri, msg, { httpAgent, timeout })
    .then((response) => {
      this._updateCache(msg);
      this._decreaseQueueSize();
      return response.data;
    })
    .catch((error) => {
      debug('failed to send notification', error.message);
      this._decreaseQueueSize();
    });
};
