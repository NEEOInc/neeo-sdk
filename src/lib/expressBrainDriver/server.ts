import * as bodyParser from 'body-parser';
import * as Debug from 'debug';
import * as express from 'express';
import * as http from 'http';
import { RequestHandler } from '../device/handler';
import * as crypto from './crypto';
import routeDatabase, { registerHandler as setDbHandler } from './routes/database';
import routeDevice, { registerHandler as setDeviceHandler } from './routes/deviceRoute';
import routeSecure from './routes/secure';

const debug = Debug('neeo:driver:express');

const app = express()
  .disable('x-powered-by')
  .use(bodyParser.json({ limit: '2mb' }))
  .use(crypto.generateDecryptMiddleware(crypto.decrypt))
  .use('/db', routeDatabase)
  .use('/device', routeDevice)
  .use('/secure', routeSecure)
  .use('/favicon.ico', (req, res) => res.send())
  .use(({ url }, res, next) => {
    debug('INVALID_URL_REQUESTED %o', { url });
    const err = new Error('Not Found');
    Object.assign(err, { status: 404 });
    next(err);
  })
  .use(((error, req, res, next) => {
    if (!next) {
      debug('EXPRESS_NEEDS_NEXT_PARAMETER_WEBPACK_TOO');
    }
    debug('UNHANDLED_REQUEST_ERROR', error.message);
    res.status(error.status || 500);
    res.json({ message: error.message || 'Internal Server Error' });
  }) as express.ErrorRequestHandler);

let expressServerRunning = false;
let server: undefined | http.Server;

export function startExpress(conf: { ip?: string; port?: number }, handler: RequestHandler) {
  return new Promise<void>((resolve, reject) => {
    if (!handler) {
      reject(new Error('INVALID_REQUEST_HANDLER'));
    }
    if (expressServerRunning) {
      debug('IGNORE_REQUEST_EXPRESS_SERVER_ALREADY_RUNNING');
      resolve();
      return;
    }
    setDbHandler(handler);
    setDeviceHandler(handler);
    server = http.createServer(app);
    const { ip = '0.0.0.0', port } = conf;
    server.listen(port, ip, () => {
      debug('NEEO_SDK_STARTED %o', { ip, port });
      expressServerRunning = true;
      resolve();
    });
  });
}

export function stopExpress() {
  if (!server) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) =>
    server!.close(() => {
      server = undefined;
      expressServerRunning = false;
      resolve();
    })
  );
}
