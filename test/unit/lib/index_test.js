'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const neeoapi = require('../../../lib/index');
const discover = require('../../../lib/discover');
const recipes = require('../../../lib/recipe');
const device = require('../../../lib/device');
const expressBrainDriver = require('../../../lib/expressBrainDriver');

describe('./lib/index.js - neeoapi', function() {
  const sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  it('should expose discoverOneBrain', function() {
    expect(neeoapi.discoverOneBrain).to.equal(discover.discoverOneBrain);
  });

  it('should expose getRecipes', function() {
    expect(neeoapi.getRecipes).to.equal(recipes.getAllRecipes);
  });

  it('should expose getRecipesPowerState', function() {
    expect(neeoapi.getRecipesPowerState).to.equal(recipes.getRecipePowerState);
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
