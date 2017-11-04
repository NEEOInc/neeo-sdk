'use strict';

const expect = require('chai').expect;
const urlbuilder = require('../../../../../lib/device/brain/urlbuilder.js');
const BASE_URL_GETRECIPES = '/v1/api/recipes';

describe('./lib/device/brain/urlbuilder.js', function() {

  it('should return brain url when object is provided', function() {
    const test = urlbuilder.buildBrainUrl({host:'test.local', port:6336});
    expect(test).to.equal('http://test.local:6336');
  });

  it('should return brain url when string is provided', function() {
    const test = urlbuilder.buildBrainUrl('brain.local');
    expect(test).to.equal('http://brain.local:3000');
  });

  it('should return brain url when string is provided and port is defined', function() {
    const test = urlbuilder.buildBrainUrl('brain.local', undefined, 2323);
    expect(test).to.equal('http://brain.local:2323');
  });

  it('should return brain url and path when object is provided with uri', function() {
    const test = urlbuilder.buildBrainUrl({host:'test.local', port:6336}, BASE_URL_GETRECIPES);
    expect(test).to.equal('http://test.local:6336/v1/api/recipes');
  });

  it('should return brain url and path when string is provided with uri', function() {
    const test = urlbuilder.buildBrainUrl('brain.local', BASE_URL_GETRECIPES);
    expect(test).to.equal('http://brain.local:3000/v1/api/recipes');
  });

  it('should fail to create url, with missing parameter', function() {
    expect(function() {
      urlbuilder.buildBrainUrl();
    }).to.throw(/URLBUILDER_MISSING_PARAMETER_BRAIN/);
  });

    it('should fail to create url, with invalid parameter', function() {
    expect(function() {
      urlbuilder.buildBrainUrl(6336);
    }).to.throw(/URLBUILDER_INVALID_PARAMETER_BRAIN/);
  });

});
