"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Debug = require("debug");
var debug = Debug('neeo:device:brain:BrainRegister');
var BASE_URL_REGISTER_SDK_ADAPTER = '/v1/api/registerSdkDeviceAdapter';
var BASE_URL_UNREGISTER_SDK_ADAPTER = '/v1/api/unregisterSdkDeviceAdapter';
var REST_OPTIONS = { timeout: 8000 };
function registerAdapterOnTheBrain(conf) {
    if (!conf || !conf.url || !conf.baseUrl || !conf.adapterName) {
        return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_REGISTER'));
    }
    var prefix = conf.url, baseUrl = conf.baseUrl, adapterName = conf.adapterName;
    var url = prefix + BASE_URL_REGISTER_SDK_ADAPTER;
    debug('registerAdapterOnTheBrain POST %o', {
        url: url,
        name: adapterName,
        baseUrl: baseUrl,
    });
    return axios_1.default.post(url, { name: adapterName, baseUrl: baseUrl }, REST_OPTIONS).then(function (_a) {
        var data = _a.data;
        return data;
    });
}
exports.registerAdapterOnTheBrain = registerAdapterOnTheBrain;
function unregisterAdapterOnTheBrain(conf) {
    if (!conf || !conf.url || !conf.adapterName) {
        return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
    }
    var prefix = conf.url, adapterName = conf.adapterName;
    var url = prefix + BASE_URL_UNREGISTER_SDK_ADAPTER;
    debug('unregisterAdapterOnTheBrain POST %o', {
        registerurl: url,
        name: adapterName,
    });
    return axios_1.default.post(url, { name: adapterName }, REST_OPTIONS).then(function (_a) {
        var data = _a.data;
        return data;
    });
}
exports.unregisterAdapterOnTheBrain = unregisterAdapterOnTheBrain;
//# sourceMappingURL=register.js.map