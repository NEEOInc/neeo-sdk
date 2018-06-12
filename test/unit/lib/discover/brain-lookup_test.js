'use strict';

const brainLookup = require('../../../../lib/discover/brain-lookup.js');
const config = require('../../../../lib/config');
const mdns = require('../../../../lib/discover/mdns.js');

const { TestScheduler } = require('rxjs/testing');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios');

describe('./lib/brain-lookup.js', function() {
  let testScheduler;
  const networkInterface = {};
  const originalBrainVersionSatisfactionValue = config.brainVersionSatisfaction;
  const address = '192.168.1.10';
  const host = 'cerveau';
  const port = 3000;
  const service = { addresses: [address], host, port, txt: 'txt' };

  const sandbox = sinon.sandbox.create();

  beforeEach(function() {
    config.brainVersionSatisfaction = '>=0.50.0';

    testScheduler = new TestScheduler(function(a, b) {
      // stringify is needed to test the equality of (Timeout)Error instances.
      expect(JSON.stringify(a)).deep.equal(JSON.stringify(b));
    });

    sandbox.stub(axios, 'get');
    sandbox
      .stub(mdns, 'getMdnsStream')
      .withArgs(networkInterface)
      .returns(
        testScheduler.createHotObservable('-x-', {
          x: service,
        })
      );
  });

  afterEach(function() {
    config.brainVersionSatisfaction = originalBrainVersionSatisfactionValue;
    sandbox.restore();
  });

  describe('findFirstBrain()', function() {
    it('should return a stream completing with the first service found', function() {
      brainSystemInfoReturnsVersion('0.51.0');
      testScheduler
        .expectObservable(brainLookup.findFirstBrain(networkInterface))
        .toBe('-(x|)', { x: service });
      testScheduler.flush();
    });

    context(
      'when the service contained in the stream correspond to an outdated Brain',
      function() {
        it('should return a stream completing with a TimeoutError after given timeout', function() {
          brainSystemInfoReturnsVersion('0.49.0');
          testScheduler
            .expectObservable(
              brainLookup.findFirstBrain(networkInterface, 30, testScheduler)
            )
            .toBe('----#', {}, new Error('No Brain found after 30ms!'));
          testScheduler.flush();
        });
      }
    );

    context('when the service contained in the stream is invalid', function() {
      it('should return a stream completing with a TimeoutError after given timeout', function() {
        brainSystemInfoReturnsVersion('0.51.0');
        service.txt = undefined;
        testScheduler
          .expectObservable(
            brainLookup.findFirstBrain(networkInterface, 30, testScheduler)
          )
          .toBe('----#', {}, new Error('No Brain found after 30ms!'));
        testScheduler.flush();
      });
    });

    context('when the service does not have any address', function() {
      it('should return a stream completing with a TimeoutError after given timeout', function() {
        brainSystemInfoReturnsVersion('0.51.0');
        service.addresses = [];
        testScheduler
          .expectObservable(
            brainLookup.findFirstBrain(networkInterface, 30, testScheduler)
          )
          .toBe('----#', {}, new Error('No Brain found after 30ms!'));
        testScheduler.flush();
      });
    });
  });

  function brainSystemInfoReturnsVersion(version) {
    axios.get.withArgs(`http://${address}:${port}/systeminfo`).returns([
      {
        data: {
          firmwareVersion: version,
        },
      },
    ]);
  }
});
