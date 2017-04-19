'use strict';

const expect = require('chai').expect;
const BrainRegister = require('../../../../../lib/device/brain/register.js');
const nock = require('nock');

describe('./lib/device/brain/register.js', function() {

  let netMock;

  beforeEach(function() {
    netMock = null;
    nock.cleanAll();
  });

  afterEach(function() {
    if (netMock) {
      expect(netMock.isDone()).to.equal(true);
    }
  });

  it('should fail to register on brain, missing parameter', function(done) {
    BrainRegister.registerAdapterOnTheBrain()
    .catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_REGISTER');
      done();
    });
  });

  it('should fail to register on brain, missing adapterName', function(done) {
    const url = 'http://www.lala.com';
    const baseUrl = '127.0.0.2';
    BrainRegister.registerAdapterOnTheBrain({ url, baseUrl })
    .catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_REGISTER');
      done();
    });
  });

  it('should register on brain', function(done) {
    const url = 'http://www.lala.com';
    const baseUrl = '127.0.0.2';
    const adapterName = 'foo';
    const reply = [1,2,3];

    netMock = nock(url)
      .post('/v1/api/registerSdkDeviceAdapter').reply(200, reply );

    BrainRegister.registerAdapterOnTheBrain({ url, baseUrl, adapterName })
    .then((response) => {
      expect(response).to.deep.equal(reply);
      done();
    });
  });

  it('should fail to unregister on brain, missing parameter', function(done) {
    BrainRegister.unregisterAdapterOnTheBrain()
    .catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_UNREGISTER');
      done();
    });
  });

  it('should fail to unregister on brain, missing adapterName', function(done) {
    const url = 'http://www.lala.com';
    BrainRegister.unregisterAdapterOnTheBrain({ url })
    .catch((error) => {
      expect(error.message).to.equal('BRAIN_INVALID_PARAMETER_UNREGISTER');
      done();
    });
  });

  it('should unregister on brain', function(done) {
    const url = 'http://www.lala.com';
    const adapterName = 'foo';
    const reply = [1,2,3];

    netMock = nock(url)
      .post('/v1/api/unregisterSdkDeviceAdapter').reply(200, reply );

    BrainRegister.unregisterAdapterOnTheBrain({ url, adapterName })
    .then((response) => {
      expect(response).to.deep.equal(reply);
      done();
    });
  });

});
