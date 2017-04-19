'use strict';

const expect = require('chai').expect;
const Deviceroute = require('../../../../../../lib/device/express/routes/deviceroute');

describe('./lib/device/express/routes/deviceroute.js', function() {

  it('should fail to register invalid device (undefined)', function() {
    expect(function() {
      Deviceroute.registerDevice();
    }).to.throw(/INVALID_ADAPTER/);
  });

  it('should fail to register invalid device (no adapterName)', function() {
    expect(function() {
      Deviceroute.registerDevice({});
    }).to.throw(/INVALID_ADAPTER/);
  });

  it('should register a device', function() {
    const device = { adapterName: 'foobar' };
    Deviceroute.registerDevice(device);
  });

});
