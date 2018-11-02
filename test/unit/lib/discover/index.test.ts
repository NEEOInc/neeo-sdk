import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as brainLookup from '../../../../src/lib/discover/brainLookup';
const should = chai.should;
import * as sinon from 'sinon';
import * as Discover from '../../../../src/lib/discover/index';

import { from } from 'rxjs';

describe('./lib/discover - successful discover', () => {
  chai.use(chaiAsPromised);
  should();

  let sandbox;
  const mdnsReply = {
    addresses: ['192.168.111.32'],
    rawTxt: '',
    txt: {
      upd: '3/23/2017',
      rel: '0.29.3',
      reg: 'US',
      hon: 'NEEO-123',
    },
    name: 'NEEO Living Room',
    fqdn: 'NEEO Living Room._neeo._tcp.local',
    host: 'NEEO-123.local',
    referer: {
      address: '192.168.111.32',
      family: 'IPv4',
      port: 5353,
      size: 200,
    },
    port: 3000,
    type: 'neeo',
    protocol: 'tcp',
    subtypes: [],
  };

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    sandbox.stub(brainLookup, 'findFirstBrain').returns(from([mdnsReply]));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should discover brain', () => {
    return Discover.discoverOneBrain().should.eventually.deep.equal({
      name: 'NEEO Living Room',
      host: 'NEEO-123.local',
      port: 3000,
      version: '0.29.3',
      region: 'US',
      iparray: ['192.168.111.32'],
    });
  });
});
