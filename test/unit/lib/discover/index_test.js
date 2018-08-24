'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const brainLookup = require('../../../../lib/discover/brain-lookup.js');
const should = chai.should;
const sinon = require('sinon');
const Discover = require('../../../../lib/discover/index.js');

const { from } = require('rxjs');

describe('./lib/discover - successful discover', function() {
  chai.use(chaiAsPromised);
  should(should);

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
    sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    sandbox.stub(brainLookup, 'findFirstBrain')
      .returns(from([mdnsReply]));
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should discover brain', function() {
    return Discover.discoverOneBrain().should.eventually.deep.equal({
      name: 'NEEO Living Room',
      host: 'NEEO-123.local',
      port: 3000,
      version: '0.29.3',
      region: 'US',
      iparray: ['192.168.111.32']
    });
  });
});
