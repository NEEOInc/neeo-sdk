'use strict';

const expect = require('chai').expect;
const urlbuilder = require('../../../../../lib/device/brain/urlbuilder.js');
const BASE_URL_GETRECIPES = '/v1/api/recipes'

describe('./lib/device/brain/urlbuilder.js', function() {

  it('should return brain url when object is provided', function(done) {
    const test = urlbuilder.buildBrainUrl({host:'test.local', port:6336});
    expect(test).to.equal('http://test.local:6336');
    done();
  });

  it('should return brain url when string is provided', function(done) {
    const test = urlbuilder.buildBrainUrl('brain.local');
    expect(test).to.equal('http://brain.local:3000');
    done();
  });
  
  it('should return brain url and path when object is provided with uri', function(done) {
    const test = urlbuilder.buildBrainUrl({host:'test.local', port:6336}, BASE_URL_GETRECIPES);
    expect(test).to.equal('http://test.local:6336/v1/api/recipes');
    done();
  });

  it('should return brain url and path when string is provided with uri', function(done) {
    const test = urlbuilder.buildBrainUrl('brain.local', BASE_URL_GETRECIPES);
    expect(test).to.equal('http://brain.local:3000/v1/api/recipes');
    done();
  });
});
