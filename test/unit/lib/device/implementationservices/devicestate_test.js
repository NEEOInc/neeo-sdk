'use strict';

const expect = require('chai').expect;
const DeviceState = require('../../../../../lib/device/implementationservices/devicestate');

describe('./lib/device/implementationservices/devicestate.js', function() {

  let deviceState;

  beforeEach(function() {
    deviceState = DeviceState.buildInstance();
  });

  it('should add new device, without initial reachable state which default to true', function() {
    const ID = 123;
    const CLIENTOBJECT = { foo: 'bar' };
    deviceState.addDevice(ID, CLIENTOBJECT);
    expect(deviceState.isDeviceRegistered(ID)).to.equal(true);
    expect(deviceState.isReachable(ID)).to.equal(true);
    expect(deviceState.getClientObjectIfReachable(ID)).to.deep.equal(CLIENTOBJECT);
  });

  it('should add new device, with initial reachable state', function() {
    const ID = 123;
    const CLIENTOBJECT = { foo: 'bar' };
    const REACHABLE = true;
    deviceState.addDevice(ID, CLIENTOBJECT, REACHABLE);
    expect(deviceState.isDeviceRegistered(ID)).to.equal(true);
    expect(deviceState.isReachable(ID)).to.equal(true);
    expect(deviceState.getClientObjectIfReachable(ID)).to.deep.equal(CLIENTOBJECT);
  });

  it('should update reachable state', function() {
    const ID = 123;
    const CLIENTOBJECT = { foo: 'bar' };
    const INITIAL_REACHABLE_STATE = true;
    const NEW_NOT_REACHABLE_STATE = false;
    deviceState.addDevice(ID, CLIENTOBJECT, INITIAL_REACHABLE_STATE);
    deviceState.updateReachable(ID, NEW_NOT_REACHABLE_STATE);
    expect(deviceState.isReachable(ID)).to.equal(NEW_NOT_REACHABLE_STATE);
    expect(deviceState.getClientObjectIfReachable(ID)).to.equal(undefined);
  });

  it('should ignore invalid reachable update data (aka not equal true or false)', function() {
    const ID = 123;
    const CLIENTOBJECT = { foo: 'bar' };
    const REACHABLE_STATE = true;
    deviceState.addDevice(ID, CLIENTOBJECT, REACHABLE_STATE);
    deviceState.updateReachable(ID, 123);
    expect(deviceState.isReachable(ID)).to.equal(REACHABLE_STATE);
  });

  it('should ignore update state calls with invalid/non existent ids', function() {
    const ID = 123;
    const REACHABLE_STATE = true;
    deviceState.updateReachable(ID, REACHABLE_STATE);
    expect(deviceState.isReachable(ID)).to.equal(false);
  });

  it('should always return not reachable for not existing device', function() {
    expect(deviceState.isReachable()).to.equal(false);
  });

  it('should overwrite existing device', function() {
    const ID = 123;
    const INITIAL_CLIENTOBJECT = { foo: 'bar' };
    const NEW_CLIENTOBJECT = { foo: 'f000000' };
    deviceState.addDevice(ID, INITIAL_CLIENTOBJECT);
    deviceState.addDevice(ID, NEW_CLIENTOBJECT);
    expect(deviceState.getClientObjectIfReachable(ID)).to.deep.equal(NEW_CLIENTOBJECT);
  });

  it('should get all added devices', function() {
    const ID1 = 111;
    const CLIENTOBJECT1 = { foo: 111 };
    deviceState.addDevice(ID1, CLIENTOBJECT1);
    const ID2 = 222;
    const CLIENTOBJECT2 = { foo: 222 };
    deviceState.addDevice(ID2, CLIENTOBJECT2);
    const allDevices = deviceState.getAllDevices();
    expect(allDevices.length).to.equal(2);
  });

  it('should fail to get getCachePromise', function() {
    const ID = 111;
    return deviceState.getCachePromise(ID)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_ID');
      });
  });

  it('should cache getCachePromise call', function() {
    const ID = 111;
    const CLIENTOBJECT = { foo: 111 };
    deviceState.addDevice(ID, CLIENTOBJECT);
    let functionCallCount = 0;

    function getState() {
      return new Promise((resolve) => {
        functionCallCount++;
        resolve(functionCallCount);
      });
    }

    deviceState
      .getCachePromise(ID)
      .getValue(getState);
      
    return deviceState
      .getCachePromise(ID)
      .getValue(getState)
      .then((result) => {
        expect(result).to.equal(1);
      });
  });

});
