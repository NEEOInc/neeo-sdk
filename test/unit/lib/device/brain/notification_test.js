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

});
