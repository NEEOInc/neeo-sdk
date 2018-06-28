'use strict';

const expect = require('chai').expect;
const icon = require('../../../../../lib/device/validation/device-icon');

describe('./lib/device/validation/device-icon.js', function() {

  it('should accept valid icon', function() {
    const result = icon.getIcon('sonos');
    expect(result).to.equal('sonos');
  });

  it('should fail to get an undefined icon', function() {
    expect(() => {
      icon.getIcon();
    }).to.throw(/INVALID_ICON_NAME: undefined/);
  });

  it('should fail to get a invalid icon (foo)', function() {
    expect(() => {
      icon.getIcon('foo');
    }).to.throw(/INVALID_ICON_NAME: foo/);
  });

});
