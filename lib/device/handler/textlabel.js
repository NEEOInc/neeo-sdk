'use strict';

const BluePromise = require('bluebird');

module.exports.getText = function(handler, deviceid) {
  return BluePromise.resolve(handler(deviceid))
    .then((result) => {
      return { value: result };
    });  
};
