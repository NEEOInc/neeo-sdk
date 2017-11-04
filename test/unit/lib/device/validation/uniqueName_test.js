'use strict';

const expect = require('chai').expect;
const uniqueName = require('../../../../../lib/device/validation/uniqueName.js');

describe('./lib/device/validation/uniqueName.js', function() {

  it('should create the same name twice', function() {
    const name1 = uniqueName('foo');
    const name2 = uniqueName('foo');
    expect(name1).to.equal(name2);
  });

  it('should not create the same name from a different input', function() {
    const name1 = uniqueName('1');
    const name2 = uniqueName('2');
    expect(name1).to.not.equal(name2);
  });

  it('should create the same name twice, custom uniqe string', function() {
    const name1 = uniqueName('foo', 'la');
    const name2 = uniqueName('foo', 'la');
    const name3 = uniqueName('foo', 'lb');
    expect(name1).to.equal(name2);
    expect(name1).to.not.equal(name3);
  });

});
