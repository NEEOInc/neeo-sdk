'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const ExpressDriver = require('../../../../lib/expressBrainDriver/index');
const ExpressServer = require('../../../../lib/expressBrainDriver/server');

describe('./lib/expressBrainDriver/index.js', function() {
  const sandbox = sinon.sandbox.create();

  beforeEach(function() {
    sandbox.stub(ExpressServer);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should start server with parameters', function() {
    // GIVEN
    const conf = {};
    const handler = {};

    // WHEN
    ExpressDriver.start(conf,handler);

    // THEN
    expect(ExpressServer.startExpress.args[0][0]).to.equal(conf);
    expect(ExpressServer.startExpress.args[0][1]).to.equal(handler);
  });

  it('should stop server with conf', function() {
    // GIVEN
    const conf = {};

    // WHEN
    ExpressDriver.stop(conf);

    // THEN
    expect(ExpressServer.stopExpress.args[0][0]).to.equal(conf);
  });

  it('should register devices via server', function() {
    // GIVEN
    const device = {};

    // WHEN
    ExpressDriver.registerDevice(device);

    // THEN
    expect(ExpressServer.registerDevice.args[0][0]).to.equal(device);
  });
});
