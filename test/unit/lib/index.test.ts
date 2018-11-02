'use strict';

import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
import * as nock from 'nock';
const expect = chai.expect;
import * as sinon from 'sinon';
import config from '../../../src/lib/config';
import * as deviceLib from '../../../src/lib/device';
import * as discover from '../../../src/lib/discover';
import expressBrainDriver from '../../../src/lib/expressBrainDriver';
import * as neeoapi from '../../../src/lib/index';
import * as recipes from '../../../src/lib/recipe';

describe('./lib/index.ts - neeoapi', () => {
  const sandbox = sinon.createSandbox();
  const configStub = sandbox.stub(config);

  configStub.brainVersionSatisfaction = '0.49.0 - 0.50.0';

  afterEach(() => {
    sandbox.restore();
  });

  describe('simple checks', () => {
    it('should expose discoverOneBrain', () => {
      expect(neeoapi.discoverOneBrain).to.equal(discover.discoverOneBrain);
    });

    it('should expose getRecipes', () => {
      expect(neeoapi.getRecipes).to.equal(recipes.getRecipes);
    });

    it('should expose getActiveRecipes', () => {
      expect(neeoapi.getActiveRecipes).to.equal(recipes.getActiveRecipes);
    });

    it('should expose @deprecated getRecipesPowerState', () => {
      expect(neeoapi.getRecipesPowerState).to.equal(recipes.getActiveRecipes);
    });

    it('should expose discoverOneBrain', () => {
      expect(neeoapi.buildDevice).to.equal(deviceLib.buildCustomDevice);
    });

    it('should expose stopServer', () => {
      expect(neeoapi.stopServer).to.equal(deviceLib.stopServer);
    });

    it('should startServer using expressDriver', () => {
      // GIVEN
      const conf = { port: 0, brain: '', name: '', devices: [] };
      sandbox.stub(deviceLib, 'startServer');

      // WHEN
      neeoapi.startServer(conf);

      // THEN
      expect(deviceLib.startServer).to.have.been.calledWith(conf, expressBrainDriver);
    });
  });

  describe('enhanced checks', () => {
    let nockScope;

    beforeEach(() => {
      nockScope = null;
    });

    afterEach(() => {
      if (nockScope) {
        nockScope.done();
      }
      nock.cleanAll();
    });

    it('should not register additional subscription functions for simple device', () => {
      let callbackCalled = false;

      function callbackFunction(update, additional) {
        expect(typeof update).to.equal('function');
        expect(typeof additional.powerOnNotificationFunction).to.equal('undefined');
        expect(typeof additional.powerOffNotificationFunction).to.equal('undefined');
        callbackCalled = true;
      }

      nockScope = nock('http://foobrain:3333')
        .post('/v1/api/registerSdkDeviceAdapter')
        .reply(200)
        .get('/systeminfo')
        .reply(200, { firmwareVersion: '0.50.0' });

      const device = neeoapi
        .buildDevice('FOO')
        .setManufacturer('NEEO')
        .addButtonGroup('volume')
        .addButtonHandler(() => {})
        .registerSubscriptionFunction(callbackFunction);

      const conf = {
        brain: 'foobrain',
        brainport: 3333,
        port: 1234,
        name: 'UNIT',
        baseUrl: `http://127.0.0.1:1234/neeodeviceadapter`,
        devices: [device],
        maxConnectionAttempts: 1,
      };
      return neeoapi.startServer(conf).then(() => {
        expect(callbackCalled).to.equal(true);
      });
    });

    it('should register additional subscription functions when building a device with powerstate sensor', () => {
      let callbackCalled = false;

      function callbackFunction(update, additional) {
        expect(typeof update).to.equal('function');
        expect(typeof additional.powerOnNotificationFunction).to.equal('function');
        expect(typeof additional.powerOffNotificationFunction).to.equal('function');
        callbackCalled = true;
      }
      const device = neeoapi
        .buildDevice('FOO')
        .setManufacturer('NEEO')
        .addPowerStateSensor({ getter: (id) => true })
        .registerSubscriptionFunction(callbackFunction);

      nockScope = nock('http://foo:3333')
        .post('/v1/api/registerSdkDeviceAdapter')
        .reply(200)
        .get('/systeminfo')
        .reply(200, { firmwareVersion: '0.50.0' });

      const conf = {
        brain: 'foo',
        brainport: 3333,
        port: 3000,
        name: 'UNIT',
        baseurl: `http://127.0.0.1:1234/neeodeviceadapter`,
        devices: [device],
        maxConnectionAttempts: 1,
      };
      return neeoapi.startServer(conf).then(() => {
        expect(callbackCalled).to.equal(true);
      });
    });
  });
});
