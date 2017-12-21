'use strict';

const expect = require('chai').expect;
const devicetype = require('../../../../../lib/device/validation/devicetype.js');

describe('./lib/device/validation/devicetype.js', function() {

  it('should get TV devicetype', function() {
    const result = devicetype.getDeviceType('tv');
    expect(result).to.equal('TV');
  });

  it('should get ACCESSORY devicetype', function() {
    const result = devicetype.getDeviceType('ACCESSORY');
    expect(result).to.equal('ACCESSOIRE');
  });

  it('should get ACCESSOIRE devicetype - deprecated and used only for backwards compability', function() {
    const result = devicetype.getDeviceType('ACCEssoire');
    expect(result).to.equal('ACCESSOIRE');
  });

  it('should throw error when requesting invalid devicetype', function() {
    expect(() => {
      devicetype.getDeviceType('foo');
    }).to.throw(/INVALID_DEVICETYPE/);
  });

  it('AVRECEIVER need input commands', function() {
    const result = devicetype.needsInputCommand('AVRECEIVER');
    expect(result).to.equal(true);
  });

  it('TV need input commands', function() {
    const result = devicetype.needsInputCommand('TV');
    expect(result).to.equal(true);
  });

  it('PROJECTOR need input commands', function() {
    const result = devicetype.needsInputCommand('PROJECTOR');
    expect(result).to.equal(true);
  });

  it('VOD does NOT need input commands', function() {
    const result = devicetype.needsInputCommand('VOD');
    expect(result).to.equal(false);
  });

  it('FOO does NOT need input commands', function() {
    const result = devicetype.needsInputCommand('FOO');
    expect(result).to.equal(false);
  });

  it('TV does support timing', function() {
    const result = devicetype.doesNotSupportTiming('TV');
    expect(result).to.equal(false);
  });

  it('LIGHT does not support timing', function() {
    const result = devicetype.doesNotSupportTiming('LIGHT');
    expect(result).to.equal(true);
  });

});
