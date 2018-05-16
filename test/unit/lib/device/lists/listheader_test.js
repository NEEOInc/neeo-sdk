'use strict';

const expect = require('chai').expect;
const ListHeader = require('../../../../../lib/device/lists/listHeader');

describe('./lib/device/lists/listHeader.js', function() {

  it('should correctly set label', function() {
    // WHEN
    const listHeader = new ListHeader('title');

    // THEN
    expect(listHeader.title).to.equal('title');
  });

  it('should correctly set isHeader flag', function() {
    // WHEN
    const listHeader = new ListHeader('title');

    // THEN
    expect(listHeader.isHeader).to.equal(true);
  });

});
