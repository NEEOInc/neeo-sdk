import * as express from 'express';
import { Router } from 'express-serve-static-core';
import { RequestHandler } from '../../device/handler';

let requestHandler: RequestHandler;
export function registerHandler(handler: RequestHandler) {
  requestHandler = handler;
}

const router: Router = express
  .Router()
  .get('/search', ({ query: { q: query } }, res) => {
    res.json(query ? requestHandler.searchDevice(query) : []);
  })
  .get('/:deviceId', ({ params: { deviceId } }, res) => {
    res.json(requestHandler.getDevice(deviceId));
  });

export default router;
