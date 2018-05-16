'use strict';

const listValidation = require('../validation/list');

module.exports = class ListItem {
  constructor(params) {
    this.title = listValidation.validateTitle(params.title);
    this.label = params.label;
    this.thumbnailUri = params.thumbnailUri;
    this.browseIdentifier = params.browseIdentifier;
    this.actionIdentifier = params.actionIdentifier;
    this.isQueueable = params.isQueueable === true;
  }
};
