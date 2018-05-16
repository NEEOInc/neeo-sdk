'use strict';

const expect = require('chai').expect;
const ListTile = require('../../../../../lib/device/lists/listTile');

describe('./lib/device/lists/listTile.js', function() {

  it('should correctly set properties', function() {
    // GIVEN
    const params = {
      thumbnailUri: 'http://www.image.com/image.jpg',
      actionIdentifier: 'action',
      isQueueable: true
    };

    // WHEN
    const listTile = new ListTile(params);

    // THEN
    expect(listTile.thumbnailUri).to.equal(params.thumbnailUri);
    expect(listTile.actionIdentifier).to.equal(params.actionIdentifier);
    expect(listTile.isQueueable).to.equal(params.isQueueable);
  });

  it('should correctly set isTile flag', function() {
    // GIVEN
    const params = {
      thumbnailUri: 'http://www.image.com/image.jpg'
    };

    // WHEN
    const listTile = new ListTile(params);

    // THEN
    expect(listTile.isTile).to.equal(true);
  });

  it('should throw if there is no thumbnail', function() {
    // WHEN
    expect(() => {
      new ListTile({});
    }).to.throw(/ERROR_LIST_THUMBNAIL_EMPTY/);
  });

});
