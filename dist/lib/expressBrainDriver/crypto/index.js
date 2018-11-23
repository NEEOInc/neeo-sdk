"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var Debug = require("debug");
var openpgp = require("openpgp");
var debug = Debug('neeo:driver:express:crypto');
var SECURE_HEADER = 'x-neeo-secure';
var RSA_KEYLENGTH = 768;
var PGP_USER = { name: 'NEEO-SDK', email: 'neeo-sdk@neeo.com' };
var privateKey;
var publicKeys;
var publicKeyAscii;
function generateKey() {
    configOpenPgp();
    var startTime = Date.now();
    var passphrase = crypto.randomBytes(64).toString();
    var keyGenOptions = {
        userIds: [PGP_USER],
        numBits: RSA_KEYLENGTH,
        passphrase: passphrase,
    };
    debug('generating keys');
    return openpgp.generateKey(keyGenOptions).then(function (key) {
        publicKeyAscii = key.publicKeyArmored;
        publicKeys = openpgp.key.readArmored(key.publicKeyArmored).keys;
        privateKey = openpgp.key.readArmored(key.privateKeyArmored).keys[0];
        if (!privateKey.decrypt(passphrase)) {
            debug('key generation failed %o', {
                durationMs: Date.now() - startTime,
            });
            return Promise.reject(new Error('Wrong passphrase! Could not decrypt the private key!'));
        }
        debug('key generation complete %o', {
            durationMs: Date.now() - startTime,
        });
    });
}
exports.generateKey = generateKey;
function getPublicKey() {
    if (publicKeyAscii) {
        return Promise.resolve(publicKeyAscii);
    }
    return generateKey().then(function () { return publicKeyAscii; });
}
exports.getPublicKey = getPublicKey;
function decrypt(cipher) {
    if (isEmpty(cipher)) {
        debug('empty cipher!');
        return Promise.reject(new Error('EMPTY_CIPHER'));
    }
    if (!privateKey) {
        return Promise.reject(new Error('NO_KEYS'));
    }
    var message;
    try {
        message = openpgp.message.readArmored(cipher);
    }
    catch (err) {
        debug('READ_ARMORED_FAILED', err.message);
        return Promise.reject(err);
    }
    return openpgp.decrypt({ privateKey: privateKey, message: message })
        .then(function (_a) {
        var data = _a.data;
        return data;
    });
}
exports.decrypt = decrypt;
function encrypt(plainText) {
    if (!plainText) {
        return Promise.reject(new Error('EMPTY_PLAINTEXT'));
    }
    return openpgp.encrypt({ data: plainText, publicKeys: publicKeys })
        .then(function (_a) {
        var data = _a.data;
        return data;
    });
}
exports.encrypt = encrypt;
function generateDecryptMiddleware(decryptFunction) {
    return function (req, res, next) {
        if (requestIsNotEncrypted(req)) {
            next();
            return;
        }
        decryptFunction(req.body.data)
            .then(function (data) {
            debug('decrypted secure request');
            req.body = JSON.parse(data);
            next();
        })
            .catch(function (error) {
            debug('failed to decrypt secure request', error.message);
            var decryptError = new Error('Decryption Failed');
            decryptError.status = 401;
            next(decryptError);
        });
    };
}
exports.generateDecryptMiddleware = generateDecryptMiddleware;
function configOpenPgp() {
    openpgp.config.show_version = openpgp.config.show_comment = false;
}
function isEmpty(obj) {
    return !obj || !Object.keys(obj).length;
}
function requestIsNotEncrypted(req) {
    return (req.method !== 'POST' ||
        !req.body ||
        !req.body.data ||
        !req.headers ||
        req.headers[SECURE_HEADER] !== 'true');
}
//# sourceMappingURL=index.js.map