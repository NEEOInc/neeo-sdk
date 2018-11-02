import config from '../../../../src/lib/config';
import * as brainLookup from '../../../../src/lib/discover/brainLookup';
import * as mdns from '../../../../src/lib/discover/mdns';

import { TestScheduler } from 'rxjs/testing';

import * as chai from 'chai';
const expect = chai.expect;
import axios from 'axios';
import * as sinon from 'sinon';

describe('./lib/brainLookup.ts', () => {
  let testScheduler;
  const networkInterface = {};
  const originalBrainVersionSatisfactionValue = config.brainVersionSatisfaction;
  const address = '192.168.1.10';
  const host = 'cerveau';
  const port = 3000;
  const service = {
    addresses: [address],
    host,
    port,
    txt: 'txt' as string | undefined,
  };

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    config.brainVersionSatisfaction = '>=0.50.0';

    testScheduler = new TestScheduler((a, b) => {
      // stringify is needed to test the equality of (Timeout)Error instances.
      expect(JSON.stringify(a)).deep.equal(JSON.stringify(b));
    });

    sandbox.stub(axios, 'get');
    // sandbox.stub(axios);
    sandbox
      .stub(mdns, 'getMdnsStream')
      .withArgs(networkInterface)
      .returns(
        testScheduler.createHotObservable('-x-', {
          x: service,
        })
      );
  });

  afterEach(() => {
    config.brainVersionSatisfaction = originalBrainVersionSatisfactionValue;
    sandbox.restore();
  });

  describe('findFirstBrain()', () => {
    it('should return a stream completing with the first service found', () => {
      brainSystemInfoReturnsVersion('0.51.0');
      testScheduler
        .expectObservable(brainLookup.findFirstBrain(networkInterface))
        .toBe('-(x|)', { x: service });
      testScheduler.flush();
    });

    context('when the service contained in the stream correspond to an outdated Brain', () => {
      it('should return a stream completing with a TimeoutError after given timeout', () => {
        brainSystemInfoReturnsVersion('0.49.0');
        testScheduler
          .expectObservable(brainLookup.findFirstBrain(networkInterface, 30, testScheduler))
          .toBe('----#', {}, new Error('No Brain found after 30ms!'));
        testScheduler.flush();
      });
    });

    context('when the service contained in the stream is invalid', () => {
      it('should return a stream completing with a TimeoutError after given timeout', () => {
        brainSystemInfoReturnsVersion('0.51.0');
        service.txt = undefined;
        testScheduler
          .expectObservable(brainLookup.findFirstBrain(networkInterface, 30, testScheduler))
          .toBe('----#', {}, new Error('No Brain found after 30ms!'));
        testScheduler.flush();
      });
    });

    context('when the service does not have any address', () => {
      it('should return a stream completing with a TimeoutError after given timeout', () => {
        brainSystemInfoReturnsVersion('0.51.0');
        service.addresses = [];
        testScheduler
          .expectObservable(brainLookup.findFirstBrain(networkInterface, 30, testScheduler))
          .toBe('----#', {}, new Error('No Brain found after 30ms!'));
        testScheduler.flush();
      });
    });
  });

  function brainSystemInfoReturnsVersion(version) {
    // @ts-ignore
    axios.get.withArgs(`http://${address}:${port}/systeminfo`).returns([
      {
        data: {
          firmwareVersion: version,
        },
      },
    ]);
  }
});
