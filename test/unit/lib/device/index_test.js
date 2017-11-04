'use strict';

const expect = require('chai').expect;
const Device = require('../../../../lib/device/index');
const nock = require('nock');

describe('./lib/device/index.js', function() {

  it('should fail to buildCustomDevice, missing adaptername', function() {
    expect(function() {
      Device.buildCustomDevice();
    }).to.throw(/MISSING_ADAPTERNAME/);
  });

  it('should buildCustomDevice', function() {
    const result = Device.buildCustomDevice('foo', 'bar');
    expect(result.manufacturer).to.equal('NEEO');
    expect(result.devicename).to.equal('foo');
  });

  it('should fail to startServer, missing parameter', function() {
    return Device.startServer()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_STARTSERVER_PARAMETER');
      });
  });

  it('should fail to stopServer, missing parameter', function() {
    return Device.stopServer()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_STOPSERVER_PARAMETER');
      });
  });

  it('should start and stop server', function() {
    const BRAINADDR = 'foofoo';
    const NAME = 'bar';
    const DEVICENAME = 'simpleDevice1';
    let callbackConf, callbackRequesthandler, callbackStop;
    const mockBrainDriver = {
      start: function(_conf, _requestHandler) {
        callbackConf = _conf;
        callbackRequesthandler = _requestHandler;
      },
      stop: function(_conf) {
        callbackStop = _conf;
      }
    };
    const nockScope = nock('http://foofoo:3000')
      .post('/v1/api/registerSdkDeviceAdapter')
      .reply(200)
      .post('/v1/api/unregisterSdkDeviceAdapter')
      .reply(200);

    const device = Device
      .buildCustomDevice(DEVICENAME, '123')
      .addImageUrl({ name: 'albumcover' }, () => { return 'foo'; });

    const conf = {
      port: 3000,
      brain: BRAINADDR,
      name: NAME,
      devices: [ device ],
    };

    return Device.startServer(conf, mockBrainDriver)
      .then(() => {
        expect(callbackConf.brain).to.equal(BRAINADDR);
        expect(callbackConf.name).to.equal(NAME);
        expect(typeof callbackRequesthandler).to.equal('object');
        return Device.stopServer(conf);
      })
      .then(() => {
        nockScope.done();
        expect(callbackStop.brain).to.equal(BRAINADDR);
        expect(callbackStop.name).to.equal(NAME);
      });
  });

});
