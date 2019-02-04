'use strict';

import { expect } from 'chai';
import * as nock from 'nock';
import NeeoNotification from '../../../../../src/lib/device/brain/notification';

describe('./lib/device/brain/notification.ts', () => {
  const BRAIN_URI = 'http://localhost:5555';
  let notification: NeeoNotification;
  let netMock;

  beforeEach(() => {
    netMock = null;
    nock.cleanAll();
    notification = new NeeoNotification({ url: BRAIN_URI });
  });

  afterEach(() => {
    if (netMock) {
      expect(netMock.isDone()).to.equal(true);
    }
  });

  it('should notify brain with JSON data', () => {
    const msg = { type: 'foo', data: 'bar' };
    const answer = { data: 'reply' };
    netMock = nock(BRAIN_URI)
      .post('/v1/notifications', msg)
      .reply(200, answer);

    return notification.send(msg).then((result) => {
      expect(result).to.deep.equal(answer);
    });
  });

  it('should detect duplicate message', () => {
    const msg = { type: 'foo', data: 'bar' };
    const answer = { data: 'reply' };
    netMock = nock(BRAIN_URI)
      .post('/v1/notifications', msg)
      .reply(200, answer);

    return notification
      .send(msg)
      .then(() => {
        return notification.send(msg);
      })
      .then(() => {
        expect('should have failed').to.equal(false);
      })
      .catch((error) => {
        expect(error.message).to.equal('DUPLICATE_MESSAGE');
      });
  });

  it('should not detect two different DEVICE_SENSOR_UPDATE messages as duplicates', () => {
    const type = 'DEVICE_SENSOR_UPDATE';
    const firstEventKey = '6326866233966723072:BRIGHTNESS_SENSOR';
    const secondEventKey = '6326866233966723071:BRIGHTNESS_SENSOR';
    const firstMessage = { type, data: { sensorEventKey: firstEventKey, sensorValue: 28 } };
    const secondMessage = { type, data: { sensorEventKey: secondEventKey, sensorValue: 29 } };

    stubSuccessNotificationFromServer(firstMessage);
    stubSuccessNotificationFromServer(secondMessage);

    return notification.send(firstMessage).then(() => {
      return expect(notification.send(secondMessage)).fulfilled;
    });
  });

  // tslint:disable-next-line:max-line-length
  it('should not detect two different DEVICE_SENSOR_UPDATE messages with different event keys as duplicates', () => {
    const type = 'DEVICE_SENSOR_UPDATE';
    const firstEventKey = '6326866233966723072:BRIGHTNESS_SENSOR';
    const secondEventKey = '6326866233966723071:BRIGHTNESS_SENSOR';
    const firstMessage = { type, data: { sensorEventKey: firstEventKey, sensorValue: 28 } };
    const secondMessage = { type, data: { sensorEventKey: secondEventKey, sensorValue: 29 } };

    stubSuccessNotificationFromServer(firstMessage);
    stubSuccessNotificationFromServer(secondMessage);

    return notification.send(firstMessage).then(() => {
      return expect(notification.send(secondMessage)).fulfilled;
    });
  });

  // tslint:disable-next-line:max-line-length
  it('should not detect two different DEVICE_SENSOR_UPDATE messages with same event keys but different values as duplicates', () => {
    const type = 'DEVICE_SENSOR_UPDATE';
    const eventKey = '6326866233966723071:BRIGHTNESS_SENSOR';
    const firstMessage = { type, data: { sensorEventKey: eventKey, sensorValue: 28 } };
    const secondMessage = { type, data: { sensorEventKey: eventKey, sensorValue: 29 } };

    stubSuccessNotificationFromServer(firstMessage);
    stubSuccessNotificationFromServer(secondMessage);

    return notification.send(firstMessage).then(() => {
      return expect(notification.send(secondMessage)).fulfilled;
    });
  });

  it('should detect invalid message (undefined)', () => {
    // @ts-ignore
    return notification.send().catch((error) => {
      expect(error.message).to.equal('EMPTY_MESSAGE');
    });
  });

  it('should detect invalid message (empty)', () => {
    return notification.send({}).catch((error) => {
      expect(error.message).to.equal('EMPTY_MESSAGE');
    });
  });

  it('should not find new entry, valid data', () => {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = 28;
    const msg = { type, data };
    stubSuccessNotificationFromServer(msg);

    return expect(notification.send(msg)).fulfilled;
  });

  it('should not find new entry, valid data FALSE', () => {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = false;
    const msg = { type, data };
    stubSuccessNotificationFromServer(msg);

    return expect(notification.send(msg)).fulfilled;
  });

  it('should not find new entry, empty object', () => {
    return expect(notification.send({})).fulfilled;
  });

  it('should find cached entry', () => {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = 28;
    const msg = { type, data };
    stubSuccessNotificationFromServer(msg);

    return notification.send(msg).then(() => {
      return expect(notification.send(msg)).rejectedWith('DUPLICATE_MESSAGE');
    });
  });

  it('should find cached entry, FALSE', () => {
    const type = '6326866233966723072:BRIGHTNESS_SENSOR';
    const data = false;
    const msg = { type, data };
    stubSuccessNotificationFromServer(msg);

    return notification.send(msg).then(() => {
      return expect(notification.send(msg)).rejectedWith('DUPLICATE_MESSAGE');
    });
  });

  function stubSuccessNotificationFromServer(msg) {
    netMock = nock(BRAIN_URI)
      .post('/v1/notifications', msg)
      .reply(200, { data: 'reply' });
  }
});
