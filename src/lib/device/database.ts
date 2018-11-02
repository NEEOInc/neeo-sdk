import * as Debug from 'debug';
import * as Tokensearch from 'tokensearch.js';
import * as Models from '../models';

const MAX_SEARCH_RESULTS = 10;
const SEARCH_MATCHFACTOR = 0.5;

const debug = Debug('neeo:device:Database');

export class Database {
  public static build(adapters: ReadonlyArray<Models.DeviceAdapterModel>) {
    debug('build new Database, # entries:', adapters.length);
    return new Database(adapters);
  }

  private readonly initializedDevices: Set<string>;
  private readonly devices: Models.DeviceModel[];
  private readonly deviceMap: { [key: string]: Models.DeviceAdapterModel };
  private readonly deviceIndex: Tokensearch<Models.DeviceModel>;

  constructor(adapters: ReadonlyArray<Models.DeviceAdapterModel>) {
    this.devices = [];
    this.deviceMap = {};
    this.initializedDevices = new Set();
    let index = 0;

    adapters.forEach((adapter) => {
      const {
        adapterName,
        devices,
        type,
        manufacturer,
        setup,
        timing,
        capabilities,
        deviceCapabilities,
      } = adapter;

      debug('build adapter.adapterName', adapterName);
      devices.forEach((device) => {
        debug(
          'build adapter.adapterName',
          adapter.adapterName,
          index,
          adapter.manufacturer,
          device.name
        );
        const { icon, name, tokens } = device;
        this.devices.push({
          id: index++,
          adapterName,
          type,
          manufacturer,
          driverVersion: adapter.driverVersion,
          name,
          tokens: tokens.join(' '),
          device,
          setup,
          timing: timing || {},
          capabilities,
          deviceCapabilities,
          icon,
        });
      });
      this.deviceMap[adapterName] = adapter;
    });

    this.deviceIndex = new Tokensearch(this.devices, {
      unique: true,
      delimiter: ' ',
      collectionKeys: ['manufacturer', 'name', 'type', 'tokens'],
      threshold: SEARCH_MATCHFACTOR,
    });
  }

  public search(query?: string) {
    if (!query) {
      return [];
    }
    return this.deviceIndex.search(query.toLowerCase()).slice(0, MAX_SEARCH_RESULTS);
  }

  public getDevice(id: number) {
    const { devices } = this;
    if (!devices[id]) {
      throw new Error('GET_DEVICE__INVALID_DEVICE_REQUESTED_' + id);
    }
    debug('get device with id %s', id);
    return devices[id];
  }

  public getAdapterDefinition(adapterName: string) {
    const spec = this.devices.find((device) => device.adapterName === adapterName);
    if (!spec) {
      throw new Error('INVALID_ADAPTER_REQUESTED_' + adapterName);
    }
    debug('get adapter with name %s', adapterName);

    return spec;
  }

  public getDeviceByAdapterId(adapterId: string) {
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
        .catch((error) => {
          debug('INIT_CONTROLLER_FAILED', error && error.message ? error.message : '');
          initializedDevices.delete(id);
        });
    });
  }
}
