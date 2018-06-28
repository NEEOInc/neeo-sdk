'use strict';

const listValidation = require('../validation/list');

module.exports = class ListButton {
  constructor(params) {
    listValidation.validateButton(params);
    this.isButton = true;
    this.title = params.title;
    this.iconName = listValidation.validateButtonIcon(params.iconName);
    this.inverse = params.inverse;
    this.actionIdentifier = params.actionIdentifier;
  }
};
