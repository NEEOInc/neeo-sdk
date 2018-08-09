'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const nock = require('nock');
const expect = chai.expect;
const sinon = require('sinon');
const neeoapi = require('../../../lib/index');
const discover = require('../../../lib/discover');
const recipes = require('../../../lib/recipe');
const device = require('../../../lib/device');
const expressBrainDriver = require('../../../lib/expressBrainDriver');
const config = require('../../../lib/config');

describe('./lib/index.js - neeoapi', function() {
  const sandbox = sinon.createSandbox();
  const configStub = sandbox.stub(config);

  configStub.brainVersionSatisfaction = '0.49.0 - 0.50.0';

  afterEach(function() {
    sandbox.restore();
  });

  describe('simple checks', function() {
    it('should expose discoverOneBrain', function() {
      expect(neeoapi.discoverOneBrain).to.equal(discover.discoverOneBrain);
    });

    it('should expose getRecipes', function() {
      expect(neeoapi.getRecipes).to.equal(recipes.getAllRecipes);
    });

    it('should expose getActiveRecipes', function() {
      expect(neeoapi.getRecipesPowerState).to.equal(recipes.getActiveRecipes);
    });

    it('should expose discoverOneBrain', function() {
      expect(neeoapi.buildDevice).to.equal(device.buildCustomDevice);
    });

    it('should expose stopServer', function() {
      expect(neeoapi.stopServer).to.equal(device.stopServer);
    });

    it('should startServer using expressDriver', function() {
      // GIVEN
      const conf = {};
      sandbox.stub(device, 'startServer');

      // WHEN
      neeoapi.startServer(conf);

      // THEN
      expect(device.startServer).to.have.been.calledWith(conf, expressBrainDriver);
    });
  });

  describe('enhanced checks', function() {
    const mockedBrainDriver = {
      start: () => {},
      stop: () => {},
    };

    let nockScope;

    beforeEach(function() {
      nockScope = null;
    });

    afterEach(function() {
      if (nockScope) {
        nockScope.done();
      }
      nock.cleanAll();
    });

    it('should not register additional subscription functions for simple device', function() {
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
        .reply(200, { firmwareVersion: '0.51.0' });

      const device = neeoapi.buildDevice('FOO')
        .setManufacturer('NEEO')
        .addButtonGroup('volume')
        .addButtonHander(function(){})
        .registerSubscriptionFunction(callbackFunction);

      const conf = {
        brain: 'foobrain',
        brainport: 3333,
        port: 1234,
        name: 'UNIT',
        baseurl: `http://127.0.0.1:1234/neeodeviceadapter`,
        devices: [ device ],
        maxConnectionAttempts: 1,
      };
      return neeoapi.startServer(conf, mockedBrainDriver)
        .then(() => {
          expect(callbackCalled).to.equal(true);
        });
    });

    it('should register additional subscription functions when building a device with powerstate sensor', function() {
      let callbackCalled = false;

      function callbackFunction(update, additional) {
        expect(typeof update).to.equal('function');
        expect(typeof additional.powerOnNotificationFunction).to.equal('function');
        expect(typeof additional.powerOffNotificationFunction).to.equal('function');
        callbackCalled = true;
      }
      const device = neeoapi.buildDevice('FOO')
        .setManufacturer('NEEO')
        .addPowerStateSensor({ getter: function() {}})
        .registerSubscriptionFunction(callbackFunction);

      nockScope = nock('http://foo:3333')
        .post('/v1/api/registerSdkDeviceAdapter')
        .reply(200)
        .get('/systeminfo')
        .reply(200, { firmwareVersion: '0.51.0' });

      const conf = {
        brain: 'foo',
        brainport: 3333,
        port: 3000,
        name: 'UNIT',
        baseurl: `http://127.0.0.1:1234/neeodeviceadapter`,
        devices: [ device ],
        maxConnectionAttempts: 1,
      };
      return neeoapi.startServer(conf, mockedBrainDriver)
        .then(() => {
          expect(callbackCalled).to.equal(true);
        });
    });
  });

});
