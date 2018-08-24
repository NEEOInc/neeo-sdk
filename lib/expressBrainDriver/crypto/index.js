'use strict';

const openpgp = require('openpgp');
const crypto = require('crypto');
const BluePromise = require('bluebird');
const debug = require('debug')('neeo:driver:express:crypto');

const SECURE_HEADER = 'x-neeo-secure';
const RSA_KEYLENGTH = 768;
const PGP_USER = { name:'NEEO-SDK', email:'neeo-sdk@neeo.com' };

let privateKey;
let publicKeys;
let publicKeyAscii;

module.exports = {
  generateKey,
  getPublicKey,
  decrypt,
  encrypt,
  generateDecryptMiddleware,
};

function generateKey() {
  configOpenPGP();

  const startTime = Date.now();
  const passphrase = crypto.randomBytes(64);
  /*
   * Since we use a random passphrase on each start, the user
   * isn't important, however it is required by openpgp to generate
   * the key.
   */
  const keyGenOptions = {
    userIds: [PGP_USER],
    numBits: RSA_KEYLENGTH,
    passphrase,
  };
  debug('generating keys');

  return openpgp.generateKey(keyGenOptions)
    .then((key) => {
      publicKeyAscii = key.publicKeyArmored;
      publicKeys = openpgp.key.readArmored(key.publicKeyArmored).keys;
      privateKey = openpgp.key.readArmored(key.privateKeyArmored).keys[0];
      if (!privateKey.decrypt(passphrase)) {
        debug('key generation failed %o', { durationMs: Date.now() - startTime });
        return BluePromise.reject(new Error('Wrong passphrase! Could not decrypt the private key!'));
      }
      debug('key generation complete %o', { durationMs: Date.now() - startTime });
    });
}

function configOpenPGP() {
  /*jshint camelcase: false */
  openpgp.config.show_version = false;
  openpgp.config.show_comment = false;
}

/**
 * @returns {Promise} resolves to publicKey string
 */
function getPublicKey() {
  const keysNotYetGenerated = !publicKeyAscii;

  if (keysNotYetGenerated) {
    return generateKey()
      .then(() => publicKeyAscii);
  }

  return BluePromise.resolve(publicKeyAscii);
}

/**
 * Decrypt content
 * @param {string} cipher input type must be string or byte8 array
 * @returns {string} plainText decrypted content
 */
function decrypt(cipher) {
  if (isEmpty(cipher)) {
    debug('empty cipher!');
    return BluePromise.reject(new Error('EMPTY_CIPHER'));
  }

  if (!privateKey) {
    return BluePromise.reject(new Error('NO_KEYS'));
  }

  let message;
  try {
    message = openpgp.message.readArmored(cipher);
  } catch(err) {
    debug('READ_ARMORED_FAILED', err.message);
    return BluePromise.reject(err);
  }

  return openpgp.decrypt({ privateKey, message })
    .then((decryptedMessage) => decryptedMessage.data);
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

/**
 * Encrypts content
 * @param {String} plainText
 * @returns {String} encrypted cipher
 */
function encrypt(plainText) {
  if (!plainText) {
    return BluePromise.reject(new Error('EMPTY_PLAINTEXT'));
  }

  return openpgp.encrypt({ data: plainText, publicKeys })
    .then((encryptedMessage) => {
      return encryptedMessage.data;
    });
}

/**
 * Generates an express middleware which transparently decrypts encrypted
 * POST data using the secure headers
 * @param {function} decryptFunction decryption function to use
 * @return {function} returns an express middleware to decrypt requests
 */
function generateDecryptMiddleware(decryptFunction) {
  const decrypt = decryptFunction;
  return (req, res, next) => {
    if (requestIsNotEncrypted(req)) {
      next();
      return;
    }

    decrypt(req.body.data)
      .then((data) => {
        debug('decrypted secure request');
        req.body = JSON.parse(data);
        next();
      })
      .catch((error) => {
        debug('failed to decrypt secure request', error.message);
        const decryptError = new Error('Decryption Failed');
        decryptError.status = 401;
        next(decryptError);
      });
  };
}

function requestIsNotEncrypted(req) {
  return req.method !== 'POST' ||
    !req.body || !req.body.data ||
    !req.headers || req.headers[SECURE_HEADER] !== 'true';
}
