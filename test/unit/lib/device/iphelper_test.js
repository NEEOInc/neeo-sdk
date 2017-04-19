'use strict';

const expect = require('chai').expect;
const IpHelper = require('../../../../lib/device/iphelper');

describe('./lib/device/iphelper.js', function() {

  it('should fail to buildCustomDevice, missing adaptername', function() {
    const result = IpHelper.getAnyIpAddress();
    expect(result !== undefined).to.equal(true);
  });

});
