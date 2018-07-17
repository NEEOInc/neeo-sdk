import * as Debug from 'debug';
import * as Models from '../models';
import * as Tokensearch from 'tokensearch.js';

const MAX_SEARCH_RESULTS = 10;
const SEARCH_MATCHFACTOR = 0.5;

const debug = Debug('neeo:device:Database');

export class Database {
  private readonly initializedDevices: Set<string>;
  private readonly devices: Models.DeviceModel[];
  private readonly deviceMap: { [key: string]: Models.DeviceAdapterModel };
  private readonly deviceIndex: Tokensearch<Models.DeviceModel>;

  constructor(adapters: ReadonlyArray<Models.DeviceAdapterModel>) {
    this.devices = [];
    this.deviceMap = {};
    this.initializedDevices = new Set();
    let index = 0;
    adapters.forEach(adapter => {
      const {
        adapterName,
        devices,
        type,
        manufacturer,
        setup,
        timing,
        capabilities,
        deviceCapabilities
      } = adapter;
      debug('build adapter.adapterName', adapterName);
      devices.forEach(device => {
        const { icon, name, tokens } = device;
        this.devices.push({
          id: index++,
          adapterName,
          type,
          manufacturer,
          name,
          tokens: tokens.join(' '),
          device,
          setup,
          timing: timing || {},
          capabilities,
          deviceCapabilities,
          icon
        });
      });
      this.deviceMap[adapterName] = adapter;
    });
    this.deviceIndex = new Tokensearch(this.devices, {
      unique: true,
      delimiter: ' ',
      collectionKeys: ['manufacturer', 'name', 'type', 'tokens'],
      threshold: SEARCH_MATCHFACTOR
    });
  }

  search(query: string) {
    if (!query) {
      return [];
    }
    return this.deviceIndex
      .search(query.toLowerCase())
      .slice(0, MAX_SEARCH_RESULTS);
  }

  getDevice(id: number) {
    const { devices } = this;
    if (!devices[id]) {
      throw new Error('INVALID_DEVICE_REQUESTED_' + id);
    }
    debug('get device with id %s', id);
    return devices[id];
  }

  getDeviceByAdapterId(adapterId: string) {
    const { deviceMap, initializedDevices } = this;
    return new Promise<Models.DeviceAdapterModel>((resolve, reject) => {
      const entry = deviceMap[adapterId];
      if (!entry) {
        return reject(new Error(`INVALID_DEVICE_REQUESTED_${adapterId}`));
      }
      if (initializedDevices.has(adapterId)) {
        return resolve(entry);
      }
      resolve(this.lazyInitialize(entry).then(() => entry));
    });
  }

  private lazyInitialize(entry: Models.DeviceAdapterModel) {
    const { initializedDevices } = this;
    return new Promise<void>((resolve, reject) => {
      if (!entry) {
        return resolve();
      }
      const { adapterName: id } = entry;
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
        .catch(error => {
          debug(
            'INIT_CONTROLLER_FAILED',
            error && error.message ? error.message : ''
          );
          initializedDevices.delete(id);
        });
    });
  }
}
