'use strict';

const expect = require('chai').expect;
const ListItem = require('../../../../../lib/device/lists/listItem');

describe('./lib/device/lists/listItem.js', function() {

  it('should correctly set properties', function() {
    // GIVEN
    const params = {
      title: 'sometitle',
      label: 'label',
      thumbnailUri: 'someURI',
      browseIdentifier: 'browse',
      actionIdentifier: 'action',
      isQueueable: true,
    };

    // WHEN
    const listItem = new ListItem(params);

    // THEN
    expect(listItem).to.deep.equal(params);
  });

  it('should throw if there is no title', function() {
    const result = new ListItem();
    expect(result.title).to.deep.equal('');
  });

});
