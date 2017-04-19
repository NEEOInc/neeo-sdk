'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const Discover = require('../../../../lib/discover/index.js');
const mdns = require('../../../../lib/discover/mdns.js');
const BluePromise = require('bluebird');

describe('./lib/discover - successful discover', function() {
  let sandbox;
  const mdnsReply = {
    addresses: [ '192.168.111.32' ],
    rawTxt: '',
    txt: {
      upd: '3/23/2017',
      rel: '0.29.3',
      reg: 'US',
      hon: 'NEEO-123'
    },
    name: 'NEEO Living Room',
    fqdn: 'NEEO Living Room._neeo._tcp.local',
    host: 'NEEO-123.local',
    referer:{
      address: '192.168.111.32',
      family: 'IPv4',
      port: 5353,
      size: 200
    },
    port: 3000,
    type: 'neeo',
    protocol: 'tcp',
    subtypes: []
  };

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function() {
    sandbox.stub(mdns, 'findFirstNeeoBrain')
      .returns(BluePromise.resolve(mdnsReply));
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should discover brain', function() {
    return Discover.discoverOneBrain()
      .then((res) => {
        expect(res).to.deep.equal({
          name: 'NEEO Living Room',
          host: 'NEEO-123.local',
          port: 3000,
          version: '0.29.3',
          region: 'US',
          iparray: [ '192.168.111.32' ]
        });
      });
  });
});


describe('./lib/discover - failed discover', function() {
  let sandbox;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function() {
    sandbox.stub(mdns, 'findFirstNeeoBrain')
      .returns(BluePromise.reject(new Error('INVALID_SERVICE_FOUND')));
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should discover invalid brain', function() {
    return Discover.discoverOneBrain()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SERVICE_FOUND');
      });
  });

});
