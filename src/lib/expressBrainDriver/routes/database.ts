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
  .get('/adapterdefinition/:adapter_name', (req, res, next) => {
    const adapterName = req.params.adapter_name;
    try {
      res.json(requestHandler.getAdapterDefinition(adapterName));
    } catch (error) {
      next(error);
    }
  })
  .get('/:device_id', ({ params: { device_id } }, res) => {
    res.json(requestHandler.getDevice(device_id));
  });

export default router;
