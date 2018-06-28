'use strict';

const ListBuilder = require('./listBuilder');

module.exports = {
  buildList,
};

function buildList(options) {
  return new ListBuilder(options);
}
