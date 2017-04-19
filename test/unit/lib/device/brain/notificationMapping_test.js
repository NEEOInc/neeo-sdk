'use strict';

const expect = require('chai').expect;
const BrainNotificationMapping = require('../../../../../lib/device/brain/notificationMapping.js');
const nock = require('nock');

describe('./lib/device/brain/notificationMapping.js', function() {

  let netMock;

  beforeEach(function() {
    netMock = null;
    nock.cleanAll();
  });

  afterEach(function() {
    if (netMock) {
      expect(netMock.isDone()).to.equal(true);
    }
  });

  it('should fail to create new notification mapping, missing parameter', function() {
    expect(function() {
      new BrainNotificationMapping();
    }).to.throw(/INVALID_NOTIFICATIONMAPPING_PARAMETER/);
  });

  it('should fail to parse server data', function(done) {
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'button';
    const brainNotificationMapping = new BrainNotificationMapping({ adapterName, url });

    netMock = nock(url)
      .get('/v1/api/notificationkey/' + adapterName + '/' + deviceId + '/' + uniqueDeviceId).reply(200, 'reply');

    brainNotificationMapping.getNotificationKey(uniqueDeviceId, deviceId, componentName)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SERVER_RESPONSE');
        done();
      });
  });


  it('should fail to find component', function(done) {
    const serverReply = [
      { name: 'EXAMPLE-SLIDER_SENSOR', type: 'range', label: 'my slider', eventKey: '6241612146438832128:EXAMPLE-SLIDER_SENSOR' },
      { name: 'EXAMPLE-SWITCH_SENSOR', type: 'binary', label: 'my switch', eventKey: '6241612146438832128:EXAMPLE-SWITCH_SENSOR' }
    ];
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'button';
    const brainNotificationMapping = new BrainNotificationMapping({ adapterName, url });

    netMock = nock(url)
      .get('/v1/api/notificationkey/' + adapterName + '/' + deviceId + '/' + uniqueDeviceId).reply(200, serverReply);

    brainNotificationMapping.getNotificationKey(uniqueDeviceId, deviceId, componentName)
      .catch((error) => {
        expect(error.message).to.equal('COMPONENTNAME_NOT_FOUND');
        done();
      });
  });


  it('should successfully find notification key by name', function(done) {
    const serverReply = [
      { name: 'slider001', type: 'range', label: 'my slider', eventKey: '6241612146438832128:EXAMPLE-SLIDER_SENSOR' },
      { name: 'EXAMPLE-SWITCH_SENSOR', type: 'binary', label: 'my switch', eventKey: '6241612146438832128:EXAMPLE-SWITCH_SENSOR' }
    ];
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'slider001';
    const brainNotificationMapping = new BrainNotificationMapping({ adapterName, url });

    netMock = nock(url)
      .get('/v1/api/notificationkey/' + adapterName + '/' + deviceId + '/' + uniqueDeviceId).reply(200, serverReply);

    brainNotificationMapping.getNotificationKey(uniqueDeviceId, deviceId, componentName)
      .then((result) => {
        expect(result).to.equal('6241612146438832128:EXAMPLE-SLIDER_SENSOR');
        expect(netMock.isDone()).to.equal(true);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should successfully find notification key by label', function(done) {
    const serverReply = [
      { name: 'slider001', type: 'range', label: 'my slider', eventKey: '6241612146438832128:EXAMPLE-SLIDER_SENSOR' },
      { name: 'EXAMPLE-SWITCH_SENSOR', type: 'binary', label: 'my switch', eventKey: '6241612146438832128:EXAMPLE-SWITCH_SENSOR' }
    ];
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'my slider';
    const brainNotificationMapping = new BrainNotificationMapping({ adapterName, url });

    netMock = nock(url)
      .get('/v1/api/notificationkey/' + adapterName + '/' + deviceId + '/' + uniqueDeviceId).reply(200, serverReply);

    brainNotificationMapping.getNotificationKey(uniqueDeviceId, deviceId, componentName)
      .then((result) => {
        expect(result).to.equal('6241612146438832128:EXAMPLE-SLIDER_SENSOR');
        expect(netMock.isDone()).to.equal(true);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

});
