import * as Debug from 'debug';
import axios from 'axios';

const REST_OPTIONS = { timeout: 8000 };
const debug = Debug('neeo:device:brain:BrainNotificationMapping');

type Entry = { name: string; eventKey: string; label?: string };

function createRequestId(
  adapterName: string,
  uniqueDeviceId: string,
  deviceId: string
) {
  return `${uniqueDeviceId}-${deviceId}-${adapterName}`;
}

function find(array: Entry[], property: 'name' | 'label', value: string) {
  return array.find(item => item[property] === value);
}

export default class {
  private readonly adapterName: string;
  private readonly brainUri: string;
  private readonly cache: Map<string, Entry[]>;

  constructor(options: { adapterName: string; url: string }) {
    debug('init %o', options);
    if (!options || !options.adapterName || !options.url) {
      throw new Error('INVALID_NOTIFICATIONMAPPING_PARAMETER');
    }
    const { adapterName, url } = options;
    this.adapterName = adapterName;
    this.brainUri = `${url}/v1/api/notificationkey/${adapterName}`;
    this.cache = new Map();
  }

  private fetchDataFromBrain(
    uniqueDeviceId: string,
    deviceId: string,
    componentName: string
  ) {
    const { brainUri, adapterName } = this;
    debug(
      'getNotificationKey',
      componentName,
      uniqueDeviceId,
      adapterName,
      deviceId
    );
    const url = `${brainUri}/${deviceId}/${uniqueDeviceId}`;
    debug('GET request url', url);
    return axios.get<Entry[]>(url, REST_OPTIONS).then(({ data }) => data);
  }

  private findNotificationKey(id: string, name: string) {
    return new Promise<string>((resolve, reject) => {
      const { cache } = this,
        entries = cache.get(id)!;
      let entry: Entry | undefined;
      if (
        ((entry = find(entries, 'name', name)) && entry.eventKey) ||
        ((entry = find(entries, 'label', name)) && entry.eventKey)
      ) {
        return resolve(entry.eventKey);
      }
      //cache might be outdated
      cache.delete(id);
      reject(new Error('COMPONENTNAME_NOT_FOUND ' + name));
    });
  }

  getNotificationKey(
    uniqueDeviceId: string,
    deviceId: string,
    componentName: string
  ) {
    const { cache, adapterName } = this;
    const id = createRequestId(adapterName, uniqueDeviceId, deviceId);
    if (cache.has(id)) {
      return this.findNotificationKey(id, componentName);
    }
    return this.fetchDataFromBrain(
      uniqueDeviceId,
      deviceId,
      componentName
    ).then(result => {
      if (!Array.isArray(result)) {
        return Promise.reject<string>(new Error('INVALID_SERVER_RESPONSE'));
      }
      cache.set(id, result);
      return this.findNotificationKey(id, componentName);
    });
  }
}
