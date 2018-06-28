'use strict';

const AVAILABLE_ICON_NAMES = [
  'sonos',
];

module.exports.getIcon = function(iconName) {
  const comparisonName = iconName && iconName.toLowerCase();
  if (AVAILABLE_ICON_NAMES.includes(comparisonName)) {
    return comparisonName;
  }
  throw new Error(`INVALID_ICON_NAME: ${iconName}`);
};
