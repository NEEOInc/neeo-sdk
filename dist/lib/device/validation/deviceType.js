"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TYPES = [
    'ACCESSOIRE',
    'AVRECEIVER',
    'DVB',
    'DVD',
    'GAMECONSOLE',
    'LIGHT',
    'MEDIAPLAYER',
    'MUSICPLAYER',
    'PROJECTOR',
    'TV',
    'VOD',
    'HDMISWITCH',
    'TUNER',
];
function isDeviceType(text) {
    return TYPES.includes(text);
}
function needsInputCommand(type) {
    return ['AVRECEIVER', 'TV', 'PROJECTOR', 'HDMISWITCH'].includes(type);
}
exports.needsInputCommand = needsInputCommand;
function doesNotSupportTiming(type) {
    switch (type) {
        case 'ACCESSOIRE':
        case 'LIGHT':
            return true;
    }
    return false;
}
exports.doesNotSupportTiming = doesNotSupportTiming;
function getDeviceType(type) {
    var upperCase = type.toUpperCase();
    if (isDeviceType(upperCase)) {
        return upperCase;
    }
    if (upperCase === 'ACCESSORY') {
        return 'ACCESSOIRE';
    }
    throw new Error('INVALID_DEVICETYPE_' + type);
}
exports.getDeviceType = getDeviceType;
//# sourceMappingURL=deviceType.js.map