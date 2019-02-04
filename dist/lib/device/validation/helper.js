"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInteger(intToCheck) {
    var fullfilled = Number.isInteger(intToCheck);
    if (!fullfilled) {
        throw new Error('Validation failed: no integer');
    }
}
exports.isInteger = isInteger;
function isArray(arrayToCheck) {
    var fullfilled = Array.isArray(arrayToCheck);
    if (!fullfilled) {
        throw new Error('Validation failed: no array');
    }
}
exports.isArray = isArray;
function isString(stringToCheck) {
    var fullfilled = typeof stringToCheck === 'string';
    if (!fullfilled) {
        throw new Error('Validation failed: no string');
    }
}
exports.isString = isString;
function ensurePropertyValue(objectToCheck, propertyToCheck) {
    var fullfilled = objectToCheck &&
        objectToCheck.hasOwnProperty(propertyToCheck) &&
        objectToCheck[propertyToCheck] !== null &&
        typeof objectToCheck[propertyToCheck] !== 'undefined';
    if (!fullfilled) {
        throw new Error("Validation failed: property \"" + propertyToCheck + "\" not present");
    }
}
exports.ensurePropertyValue = ensurePropertyValue;
//# sourceMappingURL=helper.js.map