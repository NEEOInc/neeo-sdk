'use strict';

const expect = require('chai').expect;
const Device = require('../../../../lib/device/index');

describe('./lib/device/index.js', function() {

  it('should fail to buildCustomDevice, missing adaptername', function() {
    expect(function() {
      Device.buildCustomDevice();
    }).to.throw(/MISSING_ADAPTERNAME/);
  });

  it('should buildCustomDevice', function() {
    const result = Device.buildCustomDevice('foo', 'bar');
    expect(result.manufacturer).to.equal('NEEO');
    expect(result.devicename).to.equal('foo');
  });

  it('should fail to searchDevice, missing adaptername', function() {
    const result = Device.searchDevice();
    expect(result).to.equal(undefined);
  });

  it('should fail to getDevice, missing adaptername', function() {
    const result = Device.getDevice();
    expect(result).to.equal(undefined);
  });

  it('should fail to startServer, missing parameter', function() {
    Device.startServer()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_STARTSERVER_PARAMETER');
      });
  });

  it('should fail to stopServer, missing parameter', function() {
    Device.stopServer()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_STOPSERVER_PARAMETER');
      });
  });

});
