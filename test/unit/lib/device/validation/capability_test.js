'use strict';

const expect = require('chai').expect;
const capability = require('../../../../../lib/device/validation/capability');

describe('./lib/device/validation/capability.js', function() {

  it('should get alwaysOn capability', function() {
    const result = capability.getCapability('alwaysOn');
    expect(result).to.equal('alwaysOn');
  });

  it('should fail to get a undefined capability', function() {
    expect(function() {
      capability.getCapability();
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (array)', function() {
    expect(function() {
      capability.getCapability([]);
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (object)', function() {
    expect(function() {
      capability.getCapability({});
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (number)', function() {
    expect(function() {
      capability.getCapability(4343);
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should fail to get a invalid capability (string)', function() {
    expect(function() {
      capability.getCapability('foo');
    }).to.throw(/INVALID_CAPABILITY/);
  });

});
