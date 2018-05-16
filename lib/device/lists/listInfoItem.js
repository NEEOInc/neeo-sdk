'use strict';

const ListItem = require('./listItem');

module.exports = class ListInfoItem extends ListItem {
  constructor(params) {
    super(params);

    this.isInfoItem = true;
    this.text = params.text;
    this.affirmativeButtonText = params.affirmativeButtonText;
    this.negativeButtonText = params.negativeButtonText;
  }
};
