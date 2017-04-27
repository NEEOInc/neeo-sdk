'use strict';

const BluePromise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const http = require('http');
const server = http.createServer(app);
const debug = require('debug')('neeo:device:express:express');

const routeDatabase = require('./routes/db');
const routeDevice = require('./routes/deviceroute');
const routeDeviceRegistration = require('./routes/deviceregistration');

app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '2mb' }));
app.use('/db', routeDatabase);
app.use('/device', routeDevice);
app.use('/', routeDeviceRegistration);
app.use('/favicon.ico', function (req, res) {
  res.send();
});

app.use(function(req, res, next) {
  debug('INVALID_URL_REQUESTED %o', { url: req.url });
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

let expressServerRunning = false;

module.exports.startExpress = function(conf) {
  return new BluePromise((resolve) => {
    if (expressServerRunning) {
      debug('IGNORE_REQUEST_EXPRESS_SERVER_ALREADY_RUNNING');
      resolve();
      return;
    }
    const ip = conf.ip || '0.0.0.0';
    server.listen(conf.port, ip, () => {
      debug('NEEO_SDK_STARTED %o', { ip: ip, port: conf.port });
      expressServerRunning = true;
      resolve();
    });
  });
};

module.exports.stopExpress = function() {
  return new BluePromise((resolve) => {
    server.close((param) => {
      //TODO check for errors
      expressServerRunning = false;
      resolve(param);
    });
  });
};

module.exports.registerDeviceRoute = function(device) {
  routeDevice.registerDevice(device);
};
