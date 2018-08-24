'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const BluePromise = require('bluebird');

const crypto = require('../../../../../lib/expressBrainDriver/crypto/index.js');

const EXPECTED_PUBKEY_LENGTH = 810;

describe('./crytpo/index.js,', function() {
  before(function() {
    return crypto.generateKey();
  });

  describe('getPublicKey()', function() {
    it('should return public key', function() {
      return crypto.getPublicKey()
        .then((pubkey) => {
          expect(pubkey).to.be.a('string');
          expect(pubkey.length).to.equal(EXPECTED_PUBKEY_LENGTH);
        });
    });
  });

  describe('encrypt()', function() {
    it('should encrypt data', function() {
      const testData = {
        username: 'foo@bar.com',
        password: 'verySecret!123'
      };
      const inputText = JSON.stringify(testData);
      return crypto.encrypt(inputText)
        .then((encrypted) => {
          expect(encrypted).to.be.a('string');
          expect(encrypted.length).to.equal(367);
        });
    });

    it('should not try to encrypt undefined data', function() {
      return crypto.encrypt()
        .then(() => { throw new Error('Unexpected: no error'); })
        .catch((error) => {
          expect(error.message).to.contain('EMPTY_PLAINTEXT');
        });
    });
  });

  describe('decrypt()', function() {
    it('should not try to decrypt undefined data', function() {
      return crypto.decrypt()
        .then(() => { throw new Error('Unexpected: no error'); })
        .catch((error) => {
          expect(error.message).to.contain('EMPTY_CIPHER');
        });
    });

    it('should not try to decrypt undefined data', function() {
      return crypto.decrypt({})
        .then(() => { throw new Error('Unexpected: no error'); })
        .catch((error) => {
          expect(error.message).to.contain('EMPTY_CIPHER');
        });
    });

    it('should encrypt / decrypt data', function() {
      const testData = {
        username: 'foo@bar.com',
        password: 'verySe/><[?!cret!123'
      };
      const inputText = JSON.stringify(testData);
      return crypto.encrypt(inputText)
        .then((encrypted) => crypto.decrypt(encrypted))
        .then((result) => {
          const resultJson = JSON.parse(result);
          expect(resultJson).to.deep.equal(testData);
        });
    });

    it('should encrypt / decrypt utf8 data', function() {
      const testData = {
        username: 'foo@bar.✓✓✓✓com',
        password: 'verySe/><[?!cret!123 ✓✓✓✓'
      };
      const inputText = JSON.stringify(testData);

      return crypto.encrypt(inputText)
        .then((encrypted) => crypto.decrypt(encrypted))
        .then((result) => {
          const resultJson = JSON.parse(result);
          expect(resultJson).to.deep.equal(testData);
        });
    });

  });

  describe('generateDecryptMiddleware()', function() {
    let next, nextPromise, decrypt;

    beforeEach(function() {
      next = sinon.stub();
      decrypt = sinon.stub();

      let resolve;
      nextPromise = new BluePromise((_resolve) => resolve = _resolve);
      next.callsFake(resolve);
    });

    it('should ignore GET requests', function() {
      const req = {
        method: 'GET'
      };
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore GET requests with x-neeo-secure set to true', function() {
      const req = {
        method: 'GET',
        headers: { 'x-neeo-secure': 'false' }
      };
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore POST requests with x-neeo-secure set to false', function() {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'false' }
      };
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore POST requests with missing x-neeo-secure header', function() {
      const req = {
        method: 'POST'
      };
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should process POST requests with data and x-neeo-secure set to true ', function() {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'true' },
        body: {
          data: 'encryptedContent',
        }
      };
      decrypt.resolves(JSON.stringify({ decrypted: 'content' }));

      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      return nextPromise.then(() => {
        expect(decrypt).to.have.been.calledWith('encryptedContent');
        expect(req.body).to.deep.equal({ decrypted: 'content' });
      });
    });

    it('should process POST requests with data and x-neeo-secure set to true, but fail to decrypt', function() {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'true' },
        body: {
          data: 'ignored'
        }
      };
      decrypt.rejects(new Error('failed!!'));

      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      return nextPromise.then((error) => {
        expect(decrypt).to.have.been.calledWith(req.body.data);
        expect(error.message).to.deep.equal('Decryption Failed');
      });
    });

    context('using crypto.decrypt', function() {
      it('should process POST requests with x-neeo-secure set to true, but skip to decrypt if no data', function() {
        const req = {
          method: 'POST',
          headers: { 'x-neeo-secure': 'true' },
        };

        crypto.generateDecryptMiddleware(crypto.decrypt)(req, null, next);

        return nextPromise.then((error) => {
          expect(decrypt).to.not.have.been.called;
          expect(req.body).to.equal(undefined);
          expect(error).to.equal(undefined);
        });
      });

      it('should process POST requests with x-neeo-secure set to true, but fail to decrypt due invalid data', function() {
        const req = {
          method: 'POST',
          headers: { 'x-neeo-secure': 'true' },
          body: {
            data: 'encrypted-but-invalid-data'
          }
        };

        crypto.generateDecryptMiddleware(crypto.decrypt)(req, null, next);

        return nextPromise.then((error) => {
          expect(error.message).to.deep.equal('Decryption Failed');
        });
      });
    });
  });
});
