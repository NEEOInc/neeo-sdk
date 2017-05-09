'use strict';

// common button groups, key names must be unique
const buttonGroupsRaw = {
  'Color Buttons': ['FUNCTION RED', 'FUNCTION GREEN', 'FUNCTION YELLOW', 'FUNCTION BLUE'],
  'Controlpad': ['CURSOR ENTER', 'CURSOR UP', 'CURSOR DOWN', 'CURSOR LEFT', 'CURSOR RIGHT'],
  'Numpad': ['DIGIT 0', 'DIGIT 1', 'DIGIT 2', 'DIGIT 3', 'DIGIT 4', 'DIGIT 5', 'DIGIT 6', 'DIGIT 7', 'DIGIT 8', 'DIGIT 9'],
  'Transport': ['PLAY', 'PAUSE', 'STOP'],
  'Transport Search': ['REVERSE', 'FORWARD'],
  'Transport Scan': ['PREVIOUS', 'NEXT'],
  'Transport Skip': ['SKIP SECONDS BACKWARD', 'SKIP SECONDS FORWARD'],
  'Language': ['SUBTITLE', 'LANGUAGE'],
  'Menu and Back': ['MENU', 'BACK'],
  'Volume': ['VOLUME UP', 'VOLUME DOWN', 'MUTE TOGGLE']
};

const buttonGroupsMap = new Map();
for (const key in buttonGroupsRaw) {
  if (buttonGroupsRaw.hasOwnProperty(key)) {
    buttonGroupsMap.set(key.toUpperCase(), buttonGroupsRaw[key]);
  }
}

module.exports.get = function(key) {
  if (!key || !buttonGroupsMap.has(key.toUpperCase())) {
    return;
  }
  return buttonGroupsMap.get(key.toUpperCase());
};
