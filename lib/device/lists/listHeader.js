'use strict';

const listValidation = require('../validation/list');

module.exports = class ListHeader {
  constructor(text) {
    this.isHeader = true;
    this.title = listValidation.validateTitle(text);
  }
};
