'use strict';

import { expect } from 'chai';
import { Database } from '../../../../src/lib/device/database';
import { DeviceBuilder } from '../../../../src/lib/device/deviceBuilder';
import * as Device from '../../../../src/lib/device/index';

describe('./lib/device/database.ts', () => {
  let db: Database;
  let device;

  beforeEach(() => {
    device = Device.buildCustomDevice('example-device', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(() => {})
      .build('ADAPTERNAME');
    db = Database.build([device]);
  });

  it('should find a device', () => {
    const result = db.search('example');
    expect(result.length).to.equal(1);
    // @ts-ignore
    expect(result[0].item).to.deep.equal({
      id: 0,
      adapterName: 'apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      setup: {},
      deviceCapabilities: [],
      icon: undefined,
      timing: {},
      name: 'example-device',
      tokens: 'foo',
      capabilities: [
        {
          label: 'my%20button',
          name: 'example-button',
          path: '/device/apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1/example-button',
          type: 'button',
        },
      ],
      device: {
        name: 'example-device',
        icon: undefined,
        specificname: undefined,
        tokens: ['foo'],
      },
    });
  });

  it('should not find a device', () => {
    const result = db.search();
    expect(result.length).to.equal(0);
  });

  it('should reject promise when calling getDeviceByAdapterId without parameter', () => {
    // @ts-ignore
    return db.getDeviceByAdapterId().catch((error) => {
      expect(error.message).to.contain('INVALID_DEVICE_REQUESTED');
    });
  });

  it('should find entry without controllerInit when calling getDeviceByAdapterId', () => {
    device = getValidDeviceBuilder().build();

    db = Database.build([device]);

    return db.getDeviceByAdapterId(device.adapterName).then((entry) => {
      expect(entry).to.deep.equal(device);
    });
  });

  it('should find entry with controllerInit function when calling getDeviceByAdapterId', () => {
    let initCalled = false;
    device = getValidDeviceBuilder()
      .registerInitialiseFunction(() => {
        initCalled = true;
      })
      .build();

    db = Database.build([device]);

    return db.getDeviceByAdapterId(device.adapterName).then((entry) => {
      expect(entry).to.deep.equal(device);
      expect(initCalled).to.equal(true);
    });
  });

  it('should get a device', () => {
    const result = db.getDevice(0);
    // @ts-ignore
    delete result.dataEntryTokens;
    expect(result).to.deep.equal({
      id: 0,
      adapterName: 'apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      setup: {},
      deviceCapabilities: [],
      icon: undefined,
      timing: {},
      name: 'example-device',
      tokens: 'foo',
      capabilities: [
        {
          label: 'my%20button',
          name: 'example-button',
          path: '/device/apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1/example-button',
          type: 'button',
        },
      ],
      device: {
        name: 'example-device',
        icon: undefined,
        specificname: undefined,
        tokens: ['foo'],
      },
    });
  });

  it('should fail to get a invalid device', () => {
    expect(() => {
      db.getDevice(444444440);
    }).to.throw(/INVALID_DEVICE_REQUESTED_444444440/);
  });

  it('should fail to get a undefined device', () => {
    expect(() => {
      // @ts-ignore
      db.getDevice();
    }).to.throw(/INVALID_DEVICE_REQUESTED_undefined/);
  });

  it('should return adapter device spec from adapterName', () => {
    const anotherDevice = Device.buildCustomDevice('another-device', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addButton({ name: 'another-button', label: 'another one of my buttons' })
      .addButtonHandler(() => {})
      .build('ADAPTERNAME');
    db = Database.build([device, anotherDevice]);

    const adapterName = 'apt-f0bd488a089a530fe19354b6130a643daeeb71fb';
    const result = db.getAdapterDefinition(adapterName);
    // @ts-ignore
    delete result.dataEntryTokens;

    expect(result).to.deep.equal({
      id: 1,
      adapterName: 'apt-f0bd488a089a530fe19354b6130a643daeeb71fb',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      icon: undefined,
      setup: {},
      deviceCapabilities: [],
      timing: {},
      name: 'another-device',
      tokens: 'foo',
      capabilities: [
        {
          label: 'another%20one%20of%20my%20buttons',
          name: 'another-button',
          path: '/device/apt-f0bd488a089a530fe19354b6130a643daeeb71fb/another-button',
          type: 'button',
        },
      ],
      device: {
        name: 'another-device',
        icon: undefined,
        specificname: undefined,
        tokens: ['foo'],
      },
    });
  });

  it('should fail to get adapter device spec from invalid adapterName', () => {
    const adapterName = 'invalid-adapter-name';
    expect(() => {
      db.getAdapterDefinition(adapterName);
    }).to.throw(/INVALID_ADAPTER_REQUESTED_invalid-adapter-name/);
  });
});

function getValidDeviceBuilder() {
  return new DeviceBuilder('device')
    .addButton({ name: 'name', label: 'label' })
    .addButtonHandler(() => {});
}
