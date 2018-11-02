import axios from 'axios';
import * as BluePromise from 'bluebird';
import * as Debug from 'debug';

const REST_OPTIONS = { timeout: 8000 };
const debug = Debug('neeo:device:brain:BrainNotificationMapping');

interface Entry {
  name: string;
  eventKey: string;
  label?: string;
}

function createRequestId(adapterName: string, uniqueDeviceId: string, deviceId: string) {
  return `${uniqueDeviceId}-${deviceId}-${adapterName}`;
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

  public getNotificationKeys(uniqueDeviceId: string, deviceId: string, componentName: string) {
    const id = createRequestId(this.adapterName, uniqueDeviceId, deviceId);
    if (this.cache.has(id)) {
      return this.findNotificationKeys(id, componentName);
    }
    return this.fetchDataFromBrain(uniqueDeviceId, deviceId, componentName).then(
      (notificationKeys) => {
        if (!Array.isArray(notificationKeys)) {
          return BluePromise.reject(new Error('INVALID_SERVER_RESPONSE'));
        }
        this.cache.set(id, notificationKeys);
        return this.findNotificationKeys(id, componentName);
      }
    );
  }

  private findNotificationKeys(id: string, componentName: string) {
    return new Promise((resolve, reject) => {
      const deviceDescription = this.cache.get(id) as Entry[];

      // first try to find by name
      const correctEntriesByName = deviceDescription.filter((entry) => {
        return entry.eventKey && entry.name === componentName;
      });
      if (correctEntriesByName.length > 0) {
        const notificationKeys = mapToNotificationKeys(correctEntriesByName);
        return resolve(notificationKeys);
      }
      // then try by label
      const correctEntriesByLabel = deviceDescription.filter((entry) => {
        return entry.eventKey && entry.label === componentName;
      });
      if (correctEntriesByLabel.length) {
        const notificationKeys = mapToNotificationKeys(correctEntriesByLabel);
        return resolve(notificationKeys);
      }

      // cache might be outdated
      this.cache.delete(id);
      reject(new Error('COMPONENTNAME_NOT_FOUND ' + componentName));
    });
  }

  private fetchDataFromBrain(uniqueDeviceId: string, deviceId: string, componentName: string) {
    const { brainUri, adapterName } = this;
    debug('getNotificationKey', componentName, uniqueDeviceId, adapterName, deviceId);
    const url = `${brainUri}/${deviceId}/${uniqueDeviceId}`;
    debug('GET request url', url);
    return axios.get<Entry[]>(url, REST_OPTIONS).then(({ data }) => data);
  }
}

function mapToNotificationKeys(entries) {
  return entries.map((entry) => entry.eventKey);
}
