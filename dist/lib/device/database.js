"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var Tokensearch = require("tokensearch.js");
var MAX_SEARCH_RESULTS = 10;
var SEARCH_MATCHFACTOR = 0.5;
var debug = Debug('neeo:device:Database');
var Database = (function () {
    function Database(adapters) {
        var _this = this;
        this.devices = [];
        this.deviceMap = {};
        this.initializedDevices = new Set();
        var index = 0;
        adapters.forEach(function (adapter) {
            var adapterName = adapter.adapterName, devices = adapter.devices, type = adapter.type, manufacturer = adapter.manufacturer, setup = adapter.setup, timing = adapter.timing, capabilities = adapter.capabilities, deviceCapabilities = adapter.deviceCapabilities;
            debug('parsing adapter.adapterName %o:', adapterName);
            devices.forEach(function (device) {
                debug('  device:', index, adapter.manufacturer, device.name);
                var icon = device.icon, name = device.name, tokens = device.tokens;
                _this.devices.push({
                    id: index++,
                    adapterName: adapterName,
                    type: type,
                    manufacturer: manufacturer,
                    driverVersion: adapter.driverVersion,
                    name: name,
                    tokens: tokens.join(' '),
                    device: device,
                    setup: setup,
                    timing: timing || {},
                    capabilities: capabilities,
                    deviceCapabilities: deviceCapabilities,
                    icon: icon,
                });
            });
            _this.deviceMap[adapterName] = adapter;
        });
        this.deviceIndex = new Tokensearch(this.devices, {
            unique: true,
            delimiter: ' ',
            collectionKeys: ['manufacturer', 'name', 'type', 'tokens'],
            threshold: SEARCH_MATCHFACTOR,
        });
    }
    Database.build = function (adapters) {
        debug('build new Database, # entries:', adapters.length);
        return new Database(adapters);
    };
    Database.prototype.search = function (query) {
        if (!query) {
            return [];
        }
        return this.deviceIndex.search(query.toLowerCase()).slice(0, MAX_SEARCH_RESULTS);
    };
    Database.prototype.getDevice = function (id) {
        var devices = this.devices;
        if (!devices[id]) {
            throw new Error('GET_DEVICE__INVALID_DEVICE_REQUESTED_' + id);
        }
        debug('get device with id %s', id);
        return devices[id];
    };
    Database.prototype.getAdapterDefinition = function (adapterName) {
        var spec = this.devices.find(function (device) { return device.adapterName === adapterName; });
        if (!spec) {
            throw new Error('INVALID_ADAPTER_REQUESTED_' + adapterName);
        }
        debug('get adapter with name %s', adapterName);
        return spec;
    };
    Database.prototype.getDeviceByAdapterId = function (adapterId) {
        var _this = this;
        var _a = this, deviceMap = _a.deviceMap, initializedDevices = _a.initializedDevices;
        return new Promise(function (resolve, reject) {
            var entry = deviceMap[adapterId];
            if (!entry) {
                return reject(new Error("INVALID_DEVICE_REQUESTED_" + adapterId));
            }
            if (initializedDevices.has(adapterId)) {
                return resolve(entry);
            }
            resolve(_this.lazyInitialize(entry).then(function () { return entry; }));
        });
    };
    Database.prototype.lazyInitialize = function (entry) {
        var initializedDevices = this.initializedDevices;
        return new Promise(function (resolve, reject) {
            if (!entry) {
                return resolve();
            }
            var id = entry.adapterName;
            if (initializedDevices.has(id)) {
                return resolve();
            }
            if (!entry.initialiseFunction) {
                debug('INIT_CONTROLLER_NOT_FOUND', id);
                initializedDevices.add(id);
                return resolve();
            }
            debug('INIT_CONTROLLER', id);
            initializedDevices.add(id);
            Promise.resolve(entry.initialiseFunction())
                .then(resolve)
                .catch(function (error) {
                debug('INIT_CONTROLLER_FAILED', error && error.message ? error.message : '');
                initializedDevices.delete(id);
            });
        });
    };
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=database.js.map