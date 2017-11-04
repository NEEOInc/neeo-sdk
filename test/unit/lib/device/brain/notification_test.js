'use strict';

const expect = require('chai').expect;
const NeeoNotification = require('../../../../../lib/device/brain/notification.js');
const nock = require('nock');

describe('./lib/device/brain/notification.js', function() {

  const BRAIN_URI = 'http://localhost:5555';
  let notification, netMock;

  beforeEach(function() {
    netMock = null;
    nock.cleanAll();
    notification = new NeeoNotification({ url: BRAIN_URI });
  });

  afterEach(function() {
    if (netMock) {
      expect(netMock.isDone()).to.equal(true);
    }
  });

  it('should notify brain with JSON data', function() {
    const msg = { foo: 'bar' };
    const answer = { data: 'reply' };
    netMock = nock(BRAIN_URI)
      .post('/v1/notifications', msg)
      .reply(200, answer);

    return notification.send(msg)
      .then((result) => {
        expect(result).to.deep.equal(answer);
        expect(notification.queueSize).to.equal(0);
      });
  });

  it('should decrease notification count when notification fails to send', function() {
    const msg = { foo: 'bar' };
    netMock = nock(BRAIN_URI)
      .post('/v1/notifications', msg)
      .reply(500);

    return notification.send(msg)
      .then(() => {
        expect(notification.queueSize).to.equal(0);
      });
  });

  it('should not find new entry, valid data', function() {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = 28;
    const msg = { type, data };

    const result = notification._isDuplicateMessage(msg);
    expect(result).to.equal(false);
  });

  it('should not find new entry, valid data FALSE', function() {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = false;
    const msg = { type, data };

    const result = notification._isDuplicateMessage(msg);
    expect(result).to.equal(false);
  });

  it('should not find new entry, undefined', function() {
    notification._updateCache();
    const result = notification._isDuplicateMessage();
    expect(result).to.equal(false);
  });

  it('should not find new entry, empty object', function() {
    const result = notification._isDuplicateMessage({});
    expect(result).to.equal(false);
  });

  it('should find cached entry', function() {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = 28;
    const msg = { type, data };
    notification._updateCache(msg);

    const result = notification._isDuplicateMessage(msg);
    expect(result).to.equal(true);
  });

  it('should find cached entry, FALSE', function() {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = false;
    const msg = { type, data };
    notification._updateCache(msg);

    const result = notification._isDuplicateMessage(msg);
    expect(result).to.equal(true);
  });

  it('should clear cache when threshold is exceeded', function() {
    for (let i=0; i<60; i++) {
      notification._updateCache({ type: i, data: i });
    }
    const result = notification.sensorValues.size;
    expect(result).to.equal(8);
  });

});
