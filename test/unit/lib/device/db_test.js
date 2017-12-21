'use strict';

const expect = require('chai').expect;
const Device = require('../../../../lib/device/index');
const Database = require('../../../../lib/device/db');

describe('./lib/device/db.js', function() {

  let db;

  beforeEach(function() {
    const device = Device.buildCustomDevice('example-device', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('ADAPTERNAME');
    db = Database.build([ device ]);
  });

  it('should find a device', function() {
    const result = db.search('example');
    expect(result.length).to.equal(1);
    expect(result[0].item).to.deep.equal({
      id: 0,
      adapterName: 'apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      setup: {},
      deviceCapabilities: [],
      timing: {},
      name: 'example-device',
      tokens: 'foo',
      capabilities: [
        {
          label: 'my button',
          name: 'example-button',
          path: '/device/apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1/example-button',
          type: 'button'
        }
      ],
      device: {
        name: 'example-device',
        tokens: ['foo'],
      }
    });
  });

  it('should not find a device', function() {
    const result = db.search();
    expect(result.length).to.equal(0);
  });

  it('should reject promise when calling getDeviceByAdapterId without parameter', function() {
    return db.getDeviceByAdapterId()
      .catch((error) => {
        expect(error.message).to.contain('INVALID_DEVICE_REQUESTED');
      });
  });

  it('should find entry without controllerInit function when calling getDeviceByAdapterId', function() {
    const KEY = 'key';
    const ENTRY = { adapterName: KEY };
    const unitMap = new Map();
    unitMap.set(KEY, ENTRY);
    db.deviceMap = unitMap;
    return db.getDeviceByAdapterId(KEY)
      .then((entry) => {
        expect(entry).to.deep.equal(ENTRY);
        expect(db.initialisedDevices.has(KEY)).to.equal(true);
      });
  });

  it('should find entry with controllerInit function when calling getDeviceByAdapterId', function() {
    const KEY = 'key';
    let initCalled = false;
    const ENTRY = {
      adapterName: KEY,
      initialiseFunction: () => {
        initCalled = true;
      }
    };
    const unitMap = new Map();
    unitMap.set(KEY, ENTRY);
    db.deviceMap = unitMap;
    return db.getDeviceByAdapterId(KEY)
      .then((entry) => {
        expect(entry).to.deep.equal(ENTRY);
        expect(db.initialisedDevices.has(KEY)).to.equal(true);
        expect(initCalled).to.equal(true);
      });
  });

  it('should not fail lazyInitController without argument', function() {
    return db._lazyInitController();
  });

  it('should do nothing when lazyInitController was already called', function() {
    const adapterName = 'name';
    const adapter = {
      adapterName
    };
    db.initialisedDevices.add(adapterName);
    return db._lazyInitController(adapter)
      .then(() => {
        expect(db.initialisedDevices.has(adapterName)).to.equal(true);
      });
  });

  it('should mark controller without initialisation function when run lazyInitController', function() {
    const adapterName = 'name';
    const adapter = {
      adapterName
    };
    return db._lazyInitController(adapter)
      .then(() => {
        expect(db.initialisedDevices.has(adapterName)).to.equal(true);
      });
  });

  it('should initialise controller when run lazyInitController', function() {
    const adapterName = 'name';
    let initCalled = false;
    const adapter = {
      adapterName,
      initialiseFunction: () => {
        initCalled = true;
      }
    };
    return db._lazyInitController(adapter)
      .then(() => {
        expect(db.initialisedDevices.has(adapterName)).to.equal(true);
        expect(initCalled).to.equal(true);
      });
  });

  it('should handle initialise controller error when run lazyInitController', function() {
    const adapterName = 'name';
    let initCalled = false;
    const adapter = {
      adapterName,
      initialiseFunction: () => {
        initCalled = true;
        return Promise.reject();
      }
    };
    return db._lazyInitController(adapter)
      .then(() => {
        expect(db.initialisedDevices.has(adapterName)).to.equal(false);
        expect(initCalled).to.equal(true);
      });
  });

  it('should get a device', function() {
    const result = db.getDevice(0);
    delete result.dataEntryTokens;
    expect(result).to.deep.equal({
      id: 0,
      adapterName: 'apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      setup: {},
      deviceCapabilities: [],
      timing: {},
      name: 'example-device',
      tokens: 'foo',
      capabilities: [
        {
          label: 'my button',
          name: 'example-button',
          path: '/device/apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1/example-button',
          type: 'button'
        }
      ],
      device: {
        name: 'example-device',
        tokens: ['foo'],
      }
    });
  });

  it('should fail to get a invalid device', function() {
    expect(function() {
      db.getDevice(444444440);
    }).to.throw(/INVALID_DEVICE_REQUESTED_444444440/);
  });

  it('should fail to get a undefined device', function() {
    expect(function() {
      db.getDevice();
    }).to.throw(/INVALID_DEVICE_REQUESTED_undefined/);
  });

});
