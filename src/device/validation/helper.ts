import * as validate from 'validate.js';

/*
 * Just a wrapper around the library `validate.js`.
 * BUT throwing an error in case of validation errors
 */

function ValidateWrapper(this: any, ...args: any[]) {
  const errors = validate.apply(this, args);
  if (errors) {
    throw new Error('Validation failed: ' + JSON.stringify(errors));
  }
}

namespace ValidateWrapper {
  export function isInteger(this: any, ...args: any[]) {
    const fullfilled = validate.isInteger.apply(this, args);
    if (!fullfilled) {
      throw new Error('Validation failed: no integer');
    }
  }

  export function isArray(this: any, ...args: any[]) {
    const fullfilled = validate.isArray.apply(this, args);
    if (!fullfilled) {
      throw new Error('Validation failed: no array');
    }
  }

  export function isString(this: any, ...args: any[]) {
    const fullfilled = validate.isString.apply(this, args);
    if (!fullfilled) {
      throw new Error('Validation failed: no string');
    }
  }
}

export default ValidateWrapper;
