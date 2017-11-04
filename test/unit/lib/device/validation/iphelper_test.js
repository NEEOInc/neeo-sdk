'use strict';

const expect = require('chai').expect;
const IpHelper = require('../../../../../lib/device/validation/iphelper');

describe('./lib/device/validation/iphelper.js', function() {

  it('should get any ip', function() {
    const result = IpHelper.getAnyIpAddress();
    expect(result !== undefined).to.equal(true);
    expect(result.length > 3).to.equal(true);
  });

});
