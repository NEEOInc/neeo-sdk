'use strict';

const expect = require('chai').expect;
const urlbuilder = require('../../../../../lib/device/brain/urlbuilder.js');

describe('./lib/device/brain/urlbuilder.js', function() {

  it('should return brain url when object is provided', function(done) {
    const test = urlbuilder.buildBrainUrl({host:'test.local', port:6336})
    expect(test).to.equal('http://test.local:6336');
    done();
  });

  it('should return brain url when string is provided', function(done) {
    const test = urlbuilder.buildBrainUrl('brain.local')
    expect(test).to.equal('http://brain.local:3000');
    done();
  });

});
