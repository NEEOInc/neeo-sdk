'use strict';

const axios = require('axios');
const BluePromise = require('bluebird');
const debug = require('debug')('neeo:device:brain:BrainRegister');

const BASE_URL_REGISTER_SDK_ADAPTER = '/v1/api/registerSdkDeviceAdapter';
const BASE_URL_UNREGISTER_SDK_ADAPTER = '/v1/api/unregisterSdkDeviceAdapter';
const REST_OPTIONS = { timeout: 8000 };

module.exports.registerAdapterOnTheBrain = function(conf) {
  if (!conf || !conf.url || !conf.baseUrl || !conf.adapterName) {
    return BluePromise.reject(new Error('BRAIN_INVALID_PARAMETER_REGISTER'));
  }
  const url = conf.url + BASE_URL_REGISTER_SDK_ADAPTER;
  debug('registerAdapterOnTheBrain POST %o', { registerurl: url, name: conf.adapterName, baseUrl: conf.baseUrl });
  return axios.post(url, {
      name: conf.adapterName,
      baseUrl: conf.baseUrl
    }, REST_OPTIONS)
    .then((response) => {
      return response.data;
    });
};

module.exports.unregisterAdapterOnTheBrain = function(conf) {
  if (!conf || !conf.url || !conf.adapterName) {
    return BluePromise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
  }
  const url = conf.url + BASE_URL_UNREGISTER_SDK_ADAPTER;
  debug('unregisterAdapterOnTheBrain POST %o', { registerurl: url, name: conf.adapterName });
  return axios.post(url, {
      name: conf.adapterName 
    }, REST_OPTIONS)
    .then((response) => {
      return response.data;
    });
};
