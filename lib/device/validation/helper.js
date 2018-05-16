'use strict';

const validate = require('validate.js');

/*
 * Just a wrapper around the library `validate.js`.
 * BUT throwing an error in case of validation errors
 */

const validateWrapper = module.exports = function() {
  const errors = validate.apply(this, arguments);
  if (errors) {
    throw new Error('Validation failed: ' + JSON.stringify(errors));
  }
};

validateWrapper.isInteger = function() {
  const fullfilled = validate.isInteger.apply(this, arguments);
  if (!fullfilled) {
    throw new Error('Validation failed: no integer');
  }
};

validateWrapper.isArray = function() {
  const fullfilled = validate.isArray.apply(this, arguments);
  if (!fullfilled) {
    throw new Error('Validation failed: no array');
  }
};

validateWrapper.isString = function() {
  const fullfilled = validate.isString.apply(this, arguments);
  if (!fullfilled) {
    throw new Error('Validation failed: no string');
  }
};
