"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var Debug = require("debug");
var express = require("express");
var http = require("http");
var crypto = require("./crypto");
var database_1 = require("./routes/database");
var deviceRoute_1 = require("./routes/deviceRoute");
var secure_1 = require("./routes/secure");
var debug = Debug('neeo:driver:express');
var app = express()
    .disable('x-powered-by')
    .use(bodyParser.json({ limit: '2mb' }))
    .use(crypto.generateDecryptMiddleware(crypto.decrypt))
    .use('/db', database_1.default)
    .use('/device', deviceRoute_1.default)
    .use('/secure', secure_1.default)
    .use('/favicon.ico', function (req, res) { return res.send(); })
    .use(function (_a, res, next) {
    var url = _a.url;
    debug('INVALID_URL_REQUESTED %o', { url: url });
    var err = new Error('Not Found');
    Object.assign(err, { status: 404 });
    next(err);
})
    .use((function (error, req, res, next) {
    if (!next) {
        debug('EXPRESS_NEEDS_NEXT_PARAMETER_WEBPACK_TOO');
    }
    debug('UNHANDLED_REQUEST_ERROR', error.message);
    res.status(error.status || 500);
    res.json({ message: error.message || 'Internal Server Error' });
}));
var expressServerRunning = false;
var server;
function startExpress(conf, handler) {
    return new Promise(function (resolve, reject) {
        if (!handler) {
            reject(new Error('INVALID_REQUEST_HANDLER'));
        }
        if (expressServerRunning) {
            debug('IGNORE_REQUEST_EXPRESS_SERVER_ALREADY_RUNNING');
            resolve();
            return;
        }
        database_1.registerHandler(handler);
        deviceRoute_1.registerHandler(handler);
        server = http.createServer(app);
        var _a = conf.ip, ip = _a === void 0 ? '0.0.0.0' : _a, port = conf.port;
        server.listen(port, ip, function () {
            debug('NEEO_SDK_STARTED %o', { ip: ip, port: port });
            expressServerRunning = true;
            resolve();
        });
    });
}
exports.startExpress = startExpress;
function stopExpress() {
    if (!server) {
        return Promise.resolve();
    }
    return new Promise(function (resolve) {
        return server.close(function () {
            server = undefined;
            expressServerRunning = false;
            resolve();
        });
    });
}
exports.stopExpress = stopExpress;
//# sourceMappingURL=server.js.map