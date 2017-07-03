'use strict';

module.exports.hasNoInputButtonsDefined = function(buttons) {
  if (!Array.isArray(buttons)) {
    throw new Error('NOT_ARRAY_PARAMETER');
  }
  const result = buttons.find((element) => {
    if (!element.param || !element.param.name) {
      return false;
    }
    return /INPUT.*/.test(element.param.name);
  });
  return result === undefined;
};
