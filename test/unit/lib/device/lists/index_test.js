'use strict';

const expect = require('chai').expect;
const lists = require('../../../../../lib/device/lists');

describe('./lib/device/lists/index.js', function() {

  it('should expose buildList', function() {
    expect(lists.buildList({
      title: 'foo',
      browseIdentifier: 'ident'
    })).to.not.throw;
  });

});
