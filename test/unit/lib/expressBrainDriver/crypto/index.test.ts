import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;
import * as BluePromise from 'bluebird';
import * as sinon from 'sinon';

import * as crypto from '../../../../../src/lib/expressBrainDriver/crypto';

const EXPECTED_PUBKEY_LENGTH = 810;

describe('./crytpo/index.ts,', () => {
  before(() => {
    return crypto.generateKey();
  });

  describe('getPublicKey()', () => {
    it('should return public key', () => {
      return crypto.getPublicKey().then((pubkey) => {
        expect(pubkey).to.be.a('string');
        expect(pubkey!.length).to.equal(EXPECTED_PUBKEY_LENGTH);
      });
    });
  });

  describe('encrypt()', () => {
    it('should encrypt data', () => {
      const testData = {
        username: 'foo@bar.com',
        password: 'verySecret!123',
      };
      const inputText = JSON.stringify(testData);
      return crypto.encrypt(inputText).then((encrypted) => {
        expect(encrypted).to.be.a('string');
        expect(encrypted.length).to.equal(367);
      });
    });

    it('should not try to encrypt undefined data', () => {
      // @ts-ignore
      return crypto
        .encrypt()
        .then(() => {
          throw new Error('Unexpected: no error');
        })
        .catch((error) => {
          expect(error.message).to.contain('EMPTY_PLAINTEXT');
        });
    });
  });

  describe('decrypt()', () => {
    it('should not try to decrypt undefined data', () => {
      // @ts-ignore
      return crypto
        .decrypt()
        .then(() => {
          throw new Error('Unexpected: no error');
        })
        .catch((error) => {
          expect(error.message).to.contain('EMPTY_CIPHER');
        });
    });

    it('should not try to decrypt undefined data', () => {
      return (
        crypto
          // @ts-ignore
          .decrypt({})
          .then(() => {
            throw new Error('Unexpected: no error');
          })
          .catch((error) => {
            expect(error.message).to.contain('EMPTY_CIPHER');
          })
      );
    });

    it('should encrypt / decrypt data', () => {
      const testData = {
        username: 'foo@bar.com',
        password: 'verySe/><[?!cret!123',
      };
      const inputText = JSON.stringify(testData);
      return crypto
        .encrypt(inputText)
        .then((encrypted) => crypto.decrypt(encrypted))
        .then((result) => {
          const resultJson = JSON.parse(result);
          expect(resultJson).to.deep.equal(testData);
        });
    });

    it('should encrypt / decrypt utf8 data', () => {
      const testData = {
        username: 'foo@bar.✓✓✓✓com',
        password: 'verySe/><[?!cret!123 ✓✓✓✓',
      };
      const inputText = JSON.stringify(testData);

      return crypto
        .encrypt(inputText)
        .then((encrypted) => crypto.decrypt(encrypted))
        .then((result) => {
          const resultJson = JSON.parse(result);
          expect(resultJson).to.deep.equal(testData);
        });
    });
  });

  describe('generateDecryptMiddleware()', () => {
    let next;
    let nextPromise;
    let decrypt;

    beforeEach(() => {
      next = sinon.stub();
      decrypt = sinon.stub();

      let resolve;
      nextPromise = new BluePromise((inputResolve) => (resolve = inputResolve));
      next.callsFake(resolve);
    });

    it('should ignore GET requests', () => {
      const req = {
        method: 'GET',
      };
      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore GET requests with x-neeo-secure set to true', () => {
      const req = {
        method: 'GET',
        headers: { 'x-neeo-secure': 'false' },
      };
      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore POST requests with x-neeo-secure set to false', () => {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'false' },
      };
      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should ignore POST requests with missing x-neeo-secure header', () => {
      const req = {
        method: 'POST',
      };
      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      expect(next).to.have.been.calledOnce;
      expect(decrypt).to.not.have.been.called;
    });

    it('should process POST requests with data and x-neeo-secure set to true ', () => {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'true' },
        body: {
          data: 'encryptedContent',
        },
      };
      decrypt.resolves(JSON.stringify({ decrypted: 'content' }));

      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      return nextPromise.then(() => {
        expect(decrypt).to.have.been.calledWith('encryptedContent');
        expect(req.body).to.deep.equal({ decrypted: 'content' });
      });
    });

    it('should process POST requests with data and x-neeo-secure set to true, but fail to decrypt', () => {
      const req = {
        method: 'POST',
        headers: { 'x-neeo-secure': 'true' },
        body: {
          data: 'ignored',
        },
      };
      decrypt.rejects(new Error('failed!!'));

      // @ts-ignore
      crypto.generateDecryptMiddleware(decrypt)(req, null, next);

      return nextPromise.then((error) => {
        expect(decrypt).to.have.been.calledWith(req.body.data);
        expect(error.message).to.deep.equal('Decryption Failed');
      });
    });

    context('using crypto.decrypt', () => {
      it('should process POST requests with x-neeo-secure set to true, but skip to decrypt if no data', () => {
        const req = {
          method: 'POST',
          headers: { 'x-neeo-secure': 'true' },
        };

        // @ts-ignore
        crypto.generateDecryptMiddleware(crypto.decrypt)(req, null, next);

        return nextPromise.then((error) => {
          expect(decrypt).to.not.have.been.called;
          // @ts-ignore
          expect(req.body).to.equal(undefined);
          expect(error).to.equal(undefined);
        });
      });

      it('should process POST requests with x-neeo-secure set to true, but fail to decrypt due invalid data', () => {
        const req = {
          method: 'POST',
          headers: { 'x-neeo-secure': 'true' },
          body: {
            data: 'encrypted-but-invalid-data',
          },
        };

        // @ts-ignore
        crypto.generateDecryptMiddleware(crypto.decrypt)(req, null, next);

        return nextPromise.then((error) => {
          expect(error.message).to.deep.equal('Decryption Failed');
        });
      });
    });
  });
});
