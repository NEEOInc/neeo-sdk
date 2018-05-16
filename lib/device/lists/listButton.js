'use strict';

const listValidation = require('../validation/list');

module.exports = class ListButton {
  constructor(params) {
    listValidation.validateButton(params);
    this.isButton = true;
    this.title = params.title;
    this.actionIdentifier = params.actionIdentifier;
  }
};
