"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TYPES = [
    'ACCESSOIRE',
    'AUDIO',
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
    'SOUNDBAR',
    'TUNER',
];
var FAVORITES_SUPPORT_TYPES = [
    'TV',
    'DVB',
    'TUNER',
];
var PLAYER_SUPPORT_TYPES = [
    'MEDIAPLAYER',
    'MUSICPLAYER',
    'VOD',
];
function isDeviceType(text) {
    return TYPES.includes(text);
}
function needsInputCommand(type) {
    return ['AVRECEIVER', 'TV', 'PROJECTOR', 'HDMISWITCH', 'SOUNDBAR'].includes(type);
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
function hasFavoritesSupport(type) {
    return FAVORITES_SUPPORT_TYPES.includes(type);
}
exports.hasFavoritesSupport = hasFavoritesSupport;
function hasPlayerSupport(type) {
    return PLAYER_SUPPORT_TYPES.includes(type);
}
exports.hasPlayerSupport = hasPlayerSupport;
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