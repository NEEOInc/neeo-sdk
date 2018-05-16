'use strict';

const listValidation = require('../validation/list');

module.exports = class ListTile {
  constructor(params) {
    this.isTile = true;
    this.thumbnailUri = listValidation.validateThumbnail(params.thumbnailUri);
    this.isQueueable = params.isQueueable === true;
    // Tile is currently always an actionNode (= not browsing, but trigger an action)
    this.actionIdentifier = params.actionIdentifier;
  }
};
