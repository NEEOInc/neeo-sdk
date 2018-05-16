'use strict';

const ListButton = require('./listButton');
const listValidation = require('../validation/list');

module.exports = class ListButtonRow {
  constructor(buttons) {
    listValidation.validateRow(buttons, 'buttons');
    this.buttonDefinitions = buttons;
  }

  getButtons() {
    return {
      buttons: this.buttonDefinitions.map((buttonDefinition) => {
        const button = new ListButton(buttonDefinition);
        return button;
      })
    };
  }
};
