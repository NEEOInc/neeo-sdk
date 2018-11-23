"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validate = require("./vendor/validate.min.js");
function ValidateWrapper() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var errors = validate.apply(this, args);
    if (errors) {
        throw new Error('Validation failed: ' + JSON.stringify(errors));
    }
}
(function (ValidateWrapper) {
    function isInteger() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fullfilled = validate.isInteger.apply(this, args);
        if (!fullfilled) {
            throw new Error('Validation failed: no integer');
        }
    }
    ValidateWrapper.isInteger = isInteger;
    function isArray() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fullfilled = validate.isArray.apply(this, args);
        if (!fullfilled) {
            throw new Error('Validation failed: no array');
        }
    }
    ValidateWrapper.isArray = isArray;
    function isString() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fullfilled = validate.isString.apply(this, args);
        if (!fullfilled) {
            throw new Error('Validation failed: no string');
        }
    }
    ValidateWrapper.isString = isString;
})(ValidateWrapper || (ValidateWrapper = {}));
exports.default = ValidateWrapper;
//# sourceMappingURL=helper.js.map