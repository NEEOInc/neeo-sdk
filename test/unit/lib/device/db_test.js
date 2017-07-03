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
      .addButtonHander(function(){})
      .build('ADAPTERNAME');
    Database.register(device);
    db = Database.build();
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

  it('should get a device', function() {
    const result = db.getDevice(0);
    delete result.dataEntryTokens;
    expect(result).to.deep.equal({
      id: 0,
      adapterName: 'apt-3252ba1bb8e228793c05e9efbc0b9d7642ee04d1',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      setup: {},
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

  it('should get a device', function() {
    expect(function() {
      db.getDevice(444444440);
    }).to.throw(/INVALID_DEVICE_REQUESTED_444444440/);
  });

  it('should get a device', function() {
    expect(function() {
      db.getDevice();
    }).to.throw(/INVALID_DEVICE_REQUESTED_undefined/);
  });

});
