'use strict';

const expect = require('chai').expect;
const Index = require('../../../../../lib/device/brain/index.js');
const nock = require('nock');

describe('./lib/device/brain/index.js', function() {

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

  it('should fail to send notification, missing parameter', function(done) {
    Index.sendNotification()
      .catch((error) => {
        expect(error.message).to.equal('SERVER_NOT_STARTED');
        done();
      });
  });

  it('should successfully detect invalid notification messages, using brain hostname', function(done) {
    const brain = 'brainUrl';
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';

    netMock = nock('http://brainUrl:3000').post('/v1/api/registerSdkDeviceAdapter').reply(200, '');
    Index.start({ brain, baseUrl: url, adapterName })
      .then(() => {
        expect(netMock.isDone()).to.equal(true);
        return Index.sendNotification();
      })
      .catch((error) => {
        expect(error.message).to.equal('INVALID_NOTIFICATION_DATA');
        done();
      });
  });

  it('should successfully detect invalid notification messages, using brain object', function(done) {
    const brain = {
      host: 'brainUrl',
      port: 3333
    };
    const adapterName = 'adapter0';
    const url = 'http://foo.bar';

    netMock = nock('http://brainUrl:3333').post('/v1/api/registerSdkDeviceAdapter').reply(200, '');
    Index.start({ brain, baseUrl: url, adapterName })
      .then(() => {
        expect(netMock.isDone()).to.equal(true);
        return Index.sendNotification();
      })
      .catch((error) => {
        expect(error.message).to.equal('INVALID_NOTIFICATION_DATA');
        done();
      });
  });
  
  it('should successfully send notification to brain (value 50)', function(done) {
    const serverReply = [
      { name: 'slider001', type: 'range', label: 'my slider', eventKey: '6241612146438832128:EXAMPLE-SLIDER_SENSOR' },
      { name: 'EXAMPLE-SWITCH_SENSOR', type: 'binary', label: 'my switch', eventKey: '6241612146438832128:EXAMPLE-SWITCH_SENSOR' }
    ];
    const notificationAnswer = 'hey123';
    const brain = 'brainUrl';
    const brainUrl = 'http://brainUrl:3000';
    const adapterName = 'adapter0';
    const baseUrl = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'slider001';
    let nockNotification;

    netMock = nock(brainUrl)
      .post('/v1/api/registerSdkDeviceAdapter')
      .reply(200);
    Index.start({ brain, baseUrl, adapterName })
      .then(() => {
        expect(netMock.isDone()).to.equal(true);
        netMock = nock(brainUrl)
          .get('/v1/api/notificationkey/adapter0/affeaffeaffe/0001')
          .reply(200, serverReply);
        nockNotification = nock(brainUrl)
          .post('/v1/notifications', {
            type: '6241612146438832128:EXAMPLE-SLIDER_SENSOR',
            data: 50
          })
          .reply(200, notificationAnswer);
        return Index.sendNotification({ uniqueDeviceId, component:componentName, value:50 }, deviceId);
      })
      .then((answer) => {
        expect(answer).to.equal(notificationAnswer);
        expect(nockNotification.isDone()).to.equal(true);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should successfully send notification to brain (value false)', function(done) {
    const serverReply = [
      { name: 'slider001', type: 'range', label: 'my slider', eventKey: '6241612146438832128:EXAMPLE-SLIDER_SENSOR' },
      { name: 'EXAMPLE-SWITCH_SENSOR', type: 'binary', label: 'my switch', eventKey: '6241612146438832128:EXAMPLE-SWITCH_SENSOR' }
    ];
    const notificationAnswer = 'hey123';
    const brain = 'brainUrl';
    const brainUrl = 'http://brainUrl:3000';
    const adapterName = 'adapter0';
    const baseUrl = 'http://foo.bar';
    const uniqueDeviceId = '0001';
    const deviceId = 'affeaffeaffe';
    const componentName = 'slider001';
    let nockNotification;

    netMock = nock(brainUrl)
      .post('/v1/api/registerSdkDeviceAdapter')
      .reply(200);
    Index.start({ brain, baseUrl, adapterName })
      .then(() => {
        expect(netMock.isDone()).to.equal(true);
        netMock = nock(brainUrl)
          .get('/v1/api/notificationkey/adapter0/affeaffeaffe/0001')
          .reply(200, serverReply);
        nockNotification = nock(brainUrl)
          .post('/v1/notifications', {
            type: '6241612146438832128:EXAMPLE-SLIDER_SENSOR',
            data: false
          })
          .reply(200, notificationAnswer);
        return Index.sendNotification({ uniqueDeviceId, component:componentName, value:false }, deviceId);
      })
      .then((answer) => {
        expect(answer).to.equal(notificationAnswer);
        expect(nockNotification.isDone()).to.equal(true);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

});
