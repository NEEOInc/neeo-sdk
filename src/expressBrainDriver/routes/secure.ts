import * as express from 'express';
import { Router } from 'express-serve-static-core';
import * as crypto from '../crypto';

const router: Router = express.Router().get('/pubkey', (req, res, next) => {
  return crypto
    .getPublicKey()
    .then(publickey => res.json({ publickey }))
    .catch(next);
});

export default router;
