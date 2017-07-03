'use strict';

const expect = require('chai').expect;
const inputchecker = require('../../../../../lib/device/devicetype/inputchecker.js');

describe('./lib/device/devicetype/inputchecker.js', function() {

  it('should throw error when parameter is not of type Array', function() {
    expect(() => {
      inputchecker.hasNoInputButtonsDefined('foo');
    }).to.throw(/NOT_ARRAY_PARAMETER/);
  });

  it('empty array returns missing input buttons', function() {
    const result = inputchecker.hasNoInputButtonsDefined([]);
    expect(result).to.equal(true);
  });

  it('random strings returns missing input buttons', function() {
    const result = inputchecker.hasNoInputButtonsDefined([
      {param: { name: 'FOO' }},
      {param: { name: 'INTHEBAR' }}
    ]);
    expect(result).to.equal(true);
  });

  it('should find input command', function() {
    const result = inputchecker.hasNoInputButtonsDefined([
      {param: { name: 'FOO' }},
      {param: { name: 'INPUT HDMI 1' }}
    ]);
    expect(result).to.equal(false);
  });

  it('should not ignore empty parameter', function() {
    const result = inputchecker.hasNoInputButtonsDefined([
      {param: {}},
      {foo: { bar: 'INPUT HDMI 1' }}
    ]);
    expect(result).to.equal(true);
  });

});
