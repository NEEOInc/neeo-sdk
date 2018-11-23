"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var fs_1 = require("fs");
var path_1 = require("path");
var config_1 = require("../lib/config");
var debug = Debug('neeo:cli:DeviceLoader');
function loadDevices() {
    var localDevices = [];
    try {
        localDevices = getLocalDevices();
    }
    catch (err) {
        debug('SKIPPED_LOCAL_DRIVERS', err.message);
        if (err && !err.message.includes('ENOENT')) {
            throw err;
        }
    }
    var externalDevices = getExternalDevices();
    var devices = localDevices.concat(externalDevices);
    return devices;
}
exports.loadDevices = loadDevices;
function getLocalDevices() {
    var localDriverPath = getPathFromCwdTo(config_1.default.devicesDirectory);
    return loadDevicesFrom({
        rootPath: localDriverPath,
        directory: '',
        filter: function (file) { return isExcludedFromDeviceSearch(file); },
    });
}
function getExternalDevices() {
    var externalDriversPath = getPathFromCwdTo('node_modules');
    return loadDevicesFrom({
        rootPath: externalDriversPath,
        directory: 'devices',
        filter: function (file) { return isNeeoDriver(externalDriversPath, file); },
    });
}
function isNeeoDriver(driverPath, file) {
    var isNeeoPrefixed = file.startsWith('neeo-') || file.startsWith('neeo_');
    var deviceIndexFileExists = fs_1.existsSync(path_1.join(driverPath, file, 'devices', 'index.js'));
    return isNeeoPrefixed && deviceIndexFileExists;
}
var getPathFromCwdTo = function (directory) { return path_1.join(process.cwd(), directory); };
function isExcludedFromDeviceSearch(file) {
    return config_1.default.devicesExcludedDirectories.indexOf(file) === -1;
}
function loadDevicesFrom(_a) {
    var rootPath = _a.rootPath, filter = _a.filter, _b = _a.directory, directory = _b === void 0 ? '' : _b;
    return fs_1.readdirSync(rootPath)
        .filter(filter)
        .map(function (file) {
        try {
            debug('try to load driver from', rootPath, file);
            var devicesPath = path_1.join(rootPath, file, directory);
            return require(devicesPath).devices;
        }
        catch (error) {
            console.error("Could not load devices in file '" + file + "':\u00A0" + error.message);
            console.error('DRIVER LOAD FAILED STACKTRACE:\n', error.stack);
        }
        return [];
    })
        .reduce(function (output, array) { return output.concat(array); }, [])
        .filter(function (device) { return device; });
}
//# sourceMappingURL=deviceLoader.js.map