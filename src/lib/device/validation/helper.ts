export function isInteger(intToCheck: any) {
  const fullfilled = Number.isInteger(intToCheck);
  if (!fullfilled) {
    throw new Error('Validation failed: no integer');
  }
}

export function isArray(arrayToCheck: any) {
  const fullfilled = Array.isArray(arrayToCheck);
  if (!fullfilled) {
    throw new Error('Validation failed: no array');
  }
}

export function isString(stringToCheck: any) {
  const fullfilled = typeof stringToCheck === 'string';
  if (!fullfilled) {
    throw new Error('Validation failed: no string');
  }
}

export function ensurePropertyValue(objectToCheck: any, propertyToCheck: string) {
  const fullfilled = objectToCheck &&
    objectToCheck.hasOwnProperty(propertyToCheck) &&
    objectToCheck[propertyToCheck] !== null &&
    typeof objectToCheck[propertyToCheck] !== 'undefined';
  if (!fullfilled) {
    throw new Error(`Validation failed: property "${propertyToCheck}" not present`);
  }
}
