'use strict';

import { expect } from 'chai';
import * as nock from 'nock';
import * as BrainRegister from '../../../../../src/lib/device/brain/register';

describe('./lib/device/brain/register.ts', () => {
  let netMock;

  beforeEach(() => {
    netMock = null;
    nock.cleanAll();
  });

  afterEach(() => {
    if (netMock) {
      expect(netMock.isDone()).to.equal(true);
    }
  });

  it('should fail to register on brain, missing parameter', (done) => {
    // @ts-ignore
    BrainRegister.registerAdapterOnTheBrain().catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_REGISTER');
      done();
    });
  });

  it('should fail to register on brain, missing adapterName', (done) => {
    const url = 'http://www.lala.com';
    const baseUrl = '127.0.0.2';
    // @ts-ignore
    BrainRegister.registerAdapterOnTheBrain({ url, baseUrl }).catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_REGISTER');
      done();
    });
  });

  it('should register on brain', (done) => {
    const url = 'http://www.lala.com';
    const baseUrl = '127.0.0.2';
    const adapterName = 'foo';
    const reply = [1, 2, 3];

    netMock = nock(url)
      .post('/v1/api/registerSdkDeviceAdapter')
      .reply(200, reply);

    BrainRegister.registerAdapterOnTheBrain({ url, baseUrl, adapterName }).then((response) => {
      expect(response).to.deep.equal(reply);
      done();
    });
  });

  it('should fail to unregister on brain, missing parameter', (done) => {
    // @ts-ignore
    BrainRegister.unregisterAdapterOnTheBrain().catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_UNREGISTER');
      done();
    });
  });

  it('should fail to unregister on brain, missing adapterName', (done) => {
    const url = 'http://www.lala.com';
    // @ts-ignore
    BrainRegister.unregisterAdapterOnTheBrain({ url }).catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_UNREGISTER');
      done();
    });
  });

  it('should unregister on brain', (done) => {
    const url = 'http://www.lala.com';
    const adapterName = 'foo';
    const reply = [1, 2, 3];

    netMock = nock(url)
      .post('/v1/api/unregisterSdkDeviceAdapter')
      .reply(200, reply);

    BrainRegister.unregisterAdapterOnTheBrain({ url, adapterName }).then((response) => {
      expect(response).to.deep.equal(reply);
      done();
    });
  });
});
