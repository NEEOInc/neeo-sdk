'use strict';

const BluePromise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const debug = require('debug')('neeo:driver:express');

const routeDatabase = require('./routes/db');
const routeDevice = require('./routes/deviceroute');
const routeDeviceRegistration = require('./routes/deviceregistration');

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '2mb' }));
app.use('/db', routeDatabase);
app.use('/device', routeDevice);
app.use('/', routeDeviceRegistration);
app.use('/favicon.ico', (req, res) => res.send());

app.use(function(req, res, next) {
  debug('INVALID_URL_REQUESTED %o', { url: req.url });
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

let expressServerRunning = false;
let server;

module.exports.startExpress = function(conf, requestHandler) {
  return new BluePromise((resolve) => {
    if (expressServerRunning) {
      debug('IGNORE_REQUEST_EXPRESS_SERVER_ALREADY_RUNNING');
      resolve();
      return;
    }

    routeDevice.registerHandler(requestHandler);
    routeDatabase.registerHandler(requestHandler);

    const ip = conf.ip || '0.0.0.0';
    server = http.createServer(app);
    server.listen(conf.port, ip, () => {
      debug('NEEO_SDK_STARTED %o', { ip, port: conf.port });
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
