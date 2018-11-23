"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buttonGroupsRaw = {
    'Color Buttons': ['FUNCTION RED', 'FUNCTION GREEN', 'FUNCTION YELLOW', 'FUNCTION BLUE'],
    Controlpad: ['CURSOR ENTER', 'CURSOR UP', 'CURSOR DOWN', 'CURSOR LEFT', 'CURSOR RIGHT'],
    Numpad: [
        'DIGIT 0',
        'DIGIT 1',
        'DIGIT 2',
        'DIGIT 3',
        'DIGIT 4',
        'DIGIT 5',
        'DIGIT 6',
        'DIGIT 7',
        'DIGIT 8',
        'DIGIT 9',
    ],
    Power: ['POWER ON', 'POWER OFF'],
    'Channel Zapper': ['CHANNEL UP', 'CHANNEL DOWN'],
    Transport: ['PLAY', 'PAUSE', 'STOP'],
    'Transport Search': ['REVERSE', 'FORWARD'],
    'Transport Scan': ['PREVIOUS', 'NEXT'],
    'Transport Skip': ['SKIP SECONDS BACKWARD', 'SKIP SECONDS FORWARD'],
    Language: ['SUBTITLE', 'LANGUAGE'],
    'Menu and Back': ['MENU', 'BACK'],
    Volume: ['VOLUME UP', 'VOLUME DOWN', 'MUTE TOGGLE'],
    Record: ['MY RECORDINGS', 'RECORD', 'LIVE'],
};
var buttonGroupsMap = new Map();
for (var key in buttonGroupsRaw) {
    if (buttonGroupsRaw.hasOwnProperty(key)) {
        buttonGroupsMap.set(key.toUpperCase(), buttonGroupsRaw[key]);
    }
}
function get(key) {
    if (!key || !buttonGroupsMap.has(key.toUpperCase())) {
        return;
    }
    return buttonGroupsMap.get(key.toUpperCase());
}
exports.get = get;
//# sourceMappingURL=buttonGroup.js.map