'use strict';

const ListTile = require('./listTile');
const listValidation = require('../validation/list');

module.exports = class ListTileRow {
  constructor(tiles) {
    listValidation.validateRow(tiles, 'tiles');
    this.tileDefinitions = tiles;
  }

  getTiles() {
    return {
      tiles: this.tileDefinitions.map((tileDefinition) => {
        const tile = new ListTile(tileDefinition);
        return tile;
      }),
    };
  }
};
