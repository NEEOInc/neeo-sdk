'use strict';

import { expect } from 'chai';
import { ListTileRow } from '../../../../../src/lib/device/lists/listTileRow';

describe('./lib/device/lists/listTileRow.ts', () => {
  it('should correctly build row with one tile - as object', () => {
    const tileDefinition = [
      {
        thumbnailUri: 'http://foo.com',
        actionIdentifier: 'action',
      },
    ];
    const listTileRow = new ListTileRow(tileDefinition);

    const tilesItem = listTileRow.getTiles();

    expect(tilesItem.tiles.length).to.equal(1);
    expect(tilesItem.tiles[0].actionIdentifier).to.equal(tileDefinition[0].actionIdentifier);
  });

  it('should build tiles from array - one', () => {
    const tileDefinition = [
      {
        thumbnailUri: 'http://foo.com',
        actionIdentifier: 'action',
      },
    ];
    const listTileRow = new ListTileRow(tileDefinition);

    const tilesItem = listTileRow.getTiles();

    expect(tilesItem.tiles.length).to.equal(1);
    expect(tilesItem.tiles[0].actionIdentifier).to.equal(tileDefinition[0].actionIdentifier);
  });

  it('should build tiles from array - two', () => {
    const tileDefinition = [
      {
        thumbnailUri: 'http://foo.com',
        actionIdentifier: 'action',
      },
      {
        thumbnailUri: 'http://foo.com',
        actionIdentifier: 'action2',
      },
    ];
    const listTileRow = new ListTileRow(tileDefinition);

    const tileItem = listTileRow.getTiles();

    expect(tileItem.tiles.length).to.equal(2);
  });

  it('should not build tiles for empty definition', () => {
    const buttonDefinition = [];
    const listTileRow = new ListTileRow(buttonDefinition);

    const tiles = listTileRow.getTiles();

    expect(tiles.tiles.length).to.equal(0);
  });

  it('should not build buttons for missing definition', () => {
    // @ts-ignore
    expect(() => new ListTileRow()).to.throw(/ERROR_LIST_TILES_NO_ARRAY/);
  });
});
