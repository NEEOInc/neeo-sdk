import * as openpgp from 'openpgp';
import * as crypto from 'crypto';
import * as Debug from 'debug';
import * as express from 'express';

const debug = Debug('neeo:driver:express:crypto');

const SECURE_HEADER = 'x-neeo-secure';
const RSA_KEYLENGTH = 768;
const PGP_USER = { name: 'NEEO-SDK', email: 'neeo-sdk@neeo.com' };

let privateKey: openpgp.key.Key | undefined;
let publicKeys: openpgp.key.Key[] | undefined;
let publicKeyAscii: string | undefined;

export function generateKey() {
  configOpenPgp();
  const startTime = Date.now();
  const passphrase = crypto.randomBytes(64).toString();
  /*
   * Since we use a random passphrase on each start, the user
   * isn't important, however it is required by openpgp to generate
   * the key.
   */
  const keyGenOptions = {
    userIds: [PGP_USER],
    numBits: RSA_KEYLENGTH,
    passphrase
  };
  debug('generating keys');
  return openpgp.generateKey(keyGenOptions).then(
    (key): void | Promise<void> => {
      publicKeyAscii = key.publicKeyArmored;
      publicKeys = openpgp.key.readArmored(key.publicKeyArmored).keys;
      privateKey = openpgp.key.readArmored(key.privateKeyArmored).keys[0];
      if (!privateKey.decrypt(passphrase)) {
        debug('key generation failed %o', {
          durationMs: Date.now() - startTime
        });
        return Promise.reject(
          new Error('Wrong passphrase! Could not decrypt the private key!')
        );
      }
      debug('key generation complete %o', {
        durationMs: Date.now() - startTime
      });
    }
  );
}

function configOpenPgp() {
  openpgp.config.show_version = openpgp.config.show_comment = false;
}

/**
 * Returns the public key (or generates one if not yet generated)
 * and returns the result in a promise.
 */
export function getPublicKey() {
  if (publicKeyAscii) {
    return Promise.resolve(publicKeyAscii);
  }
  return generateKey().then(() => publicKeyAscii);
}

export function decrypt(cipher: string): Promise<string> {
  if (isEmpty(cipher)) {
    debug('empty cipher!');
    return Promise.reject(new Error('EMPTY_CIPHER'));
  }
  if (!privateKey) {
    return Promise.reject(new Error('NO_KEYS'));
  }
  let message: openpgp.message.Message;
  try {
    message = openpgp.message.readArmored(cipher);
  } catch (err) {
    debug('READ_ARMORED_FAILED', err.message);
    return Promise.reject(err);
  }
  return openpgp
    .decrypt({ privateKeys: [privateKey], message })
    .then(({ data }) => data as string);
}

function isEmpty(obj: any) {
  return !obj || !Object.keys(obj).length;
}

export function encrypt(plainText: string): Promise<string> {
  if (!plainText) {
    return Promise.reject(new Error('EMPTY_PLAINTEXT'));
  }
  return openpgp
    .encrypt({ data: plainText, publicKeys })
    .then(({ data }) => data);
}

export function generateDecryptMiddleware(
  decryptFunction: (str: string) => Promise<string>
): express.RequestHandler {
  const decrypt = decryptFunction;
  return (req, res, next) => {
    if (requestIsNotEncrypted(req)) {
      next();
      return;
    }

    decrypt(req.body.data)
      .then(data => {
        debug('decrypted secure request');
        req.body = JSON.parse(data);
        next();
      })
      .catch(error => {
        debug('failed to decrypt secure request', error.message);
        const decryptError = new Error('Decryption Failed');
        (decryptError as any).status = 401;
        next(decryptError);
      });
  };
}

function requestIsNotEncrypted(req: express.Request) {
  return (
    req.method !== 'POST' ||
    !req.body ||
    !req.body.data ||
    !req.headers ||
    req.headers[SECURE_HEADER] !== 'true'
  );
}
