import axios from 'axios';
import * as Debug from 'debug';

const debug = Debug('neeo:device:brain:BrainRegister');

const BASE_URL_REGISTER_SDK_ADAPTER = '/v1/api/registerSdkDeviceAdapter';
const BASE_URL_UNREGISTER_SDK_ADAPTER = '/v1/api/unregisterSdkDeviceAdapter';
const REST_OPTIONS = { timeout: 8000 };

export function registerAdapterOnTheBrain(conf: {
  url: string;
  baseUrl: string;
  adapterName: string;
}) {
  const { url: prefix, baseUrl, adapterName } = conf;
  if (!prefix || !baseUrl || !adapterName) {
    return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_REGISTER'));
  }
  const url = prefix + BASE_URL_REGISTER_SDK_ADAPTER;
  debug('registerAdapterOnTheBrain POST %o', {
    url,
    name: adapterName,
    baseUrl
  });
  return axios
    .post(url, { name: adapterName, baseUrl }, REST_OPTIONS)
    .then(({ data }) => data);
}

export function unregisterAdapterOnTheBrain(conf: {
  url: string;
  adapterName: string;
}) {
  const { url: prefix, adapterName } = conf;
  if (!prefix || !adapterName) {
    return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
  }
  const url = prefix + BASE_URL_UNREGISTER_SDK_ADAPTER;
  debug('unregisterAdapterOnTheBrain POST %o', {
    registerurl: url,
    name: adapterName
  });
  return axios
    .post(url, { name: adapterName }, REST_OPTIONS)
    .then(({ data }) => data);
}
