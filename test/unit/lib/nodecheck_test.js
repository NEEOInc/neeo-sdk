'use strict';

const expect = require('chai').expect;
const nodeCheck = require('../../../lib/nodecheck');

describe('./lib/nodecheck.js', function() {

  it('should not throw any error when node version is >= 6.0', function() {
    expect(nodeCheck.checkNodeVersion('6.0.1')).not.to.throw;
  });

  it('should not throw any error when node version is >= 10.0', function() {
    expect(nodeCheck.checkNodeVersion('10.0.0')).not.to.throw;
  });

  it('should throw an error when node version is < 6.0', function() {
    expect(() => {
      nodeCheck.checkNodeVersion('5.9');
    }).to.throw('You must run the NEEO SDK on node >= 6.0. Your current node version is 5.9');
  });

});
