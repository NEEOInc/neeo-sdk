'use strict';

const expect = require('chai').expect;
const ListTileRow = require('../../../../../lib/device/lists/listTileRow');

describe('./lib/device/lists/listTileRow.js', function() {

  it('should correctly build row with one tile - as object', function() {
    // GIVEN
    const tileDefinition = [{
      thumbnailUri: 'http://foo.com',
      actionIdentifier: 'action',
    }];
    const listTileRow = new ListTileRow(tileDefinition);

    // WHEN
    const tilesItem = listTileRow.getTiles();

    // THEN
    expect(tilesItem.tiles.length).to.equal(1);
    expect(tilesItem.tiles[0].title).to.equal(tileDefinition[0].title);
    expect(tilesItem.tiles[0].actionIdentifier).to.equal(tileDefinition[0].actionIdentifier);
  });

  it('should build tiles from array - one', function() {
    // GIVEN
    const tileDefinition = [{
      thumbnailUri: 'http://foo.com',
      actionIdentifier: 'action',
    }];
    const listTileRow = new ListTileRow(tileDefinition);

    // WHEN
    const tilesItem = listTileRow.getTiles();

    // THEN
    expect(tilesItem.tiles.length).to.equal(1);
    expect(tilesItem.tiles[0].title).to.equal(tileDefinition[0].title);
    expect(tilesItem.tiles[0].actionIdentifier).to.equal(tileDefinition[0].actionIdentifier);
  });

  it('should build tiles from array - two', function() {
    // GIVEN
    const tileDefinition = [{
      thumbnailUri: 'http://foo.com',
      actionIdentifier: 'action',
    }, {
      thumbnailUri: 'http://foo.com',
      actionIdentifier: 'action2',
    }];
    const listTileRow = new ListTileRow(tileDefinition);

    // WHEN
    const tileItem = listTileRow.getTiles();

    // THEN
    expect(tileItem.tiles.length).to.equal(2);
    expect(tileItem.tiles[0].title).to.equal(tileDefinition[0].title);
    expect(tileItem.tiles[1].title).to.equal(tileDefinition[1].title);
  });

  it('should not build tiles for empty definition', function() {
    // GIVEN
    const buttonDefinition = [];
    const listTileRow = new ListTileRow(buttonDefinition);

    // WHEN
    const tiles = listTileRow.getTiles();

    // THEN
    expect(tiles.tiles.length).to.equal(0);
  });

  it('should not build buttons for missing definition', function() {
    expect(() => {
      new ListTileRow();
    }).to.throw(/ERROR_LIST_TILES_NO_ARRAY/);
  });

});
