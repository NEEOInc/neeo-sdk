import * as Debug from 'debug';
import * as http from 'http';
import axios from 'axios';
import * as Models from '../../models';

const httpAgent = new http.Agent({
  maxSockets: 1,
  keepAlive: true,
  keepAliveMsecs: 16000
});
const debug = Debug('neeo:device:brain:BrainNotification');

const MAXIMAL_CACHED_ENTRIES = 50;
const MAXIMAL_MESSAGE_QUEUE_SIZE = 20;
const timeout = 8000;

export default class {
  private queueSize: number;
  private readonly brainUri: string;
  private readonly sensorValues: {
    [key: string]: Models.SensorDescriptor.SensorValue;
  };

  constructor(options: { url: string }) {
    debug('init', options);
    this.queueSize = 0;
    this.brainUri = `${options.url}/v1/notifications`;
    this.sensorValues = {};
  }

  private decreaseQueueSize() {
    if (this.queueSize > 0) {
      this.queueSize--;
    }
  }

  private isDuplicateMessage(message: Models.MessageModel) {
    if (!message) {
      return false;
    }
    const { type, data } = message;
    if (!type || typeof data === 'undefined') {
      return false;
    }
    const lastSensorValue = this.sensorValues[type];
    return lastSensorValue === data;
  }

  private updateCache(message: Models.MessageModel) {
    if (!message) {
      return;
    }
    const { type, data } = message;
    if (!type || typeof data === 'undefined') {
      return;
    }
    const { sensorValues } = this;
    if (sensorValues.size > MAXIMAL_CACHED_ENTRIES) {
      debug('clear message cache');
      Object.keys(sensorValues).forEach(key => delete sensorValues[key]);
    }
    sensorValues[type] = data;
  }

  send(message: Models.MessageModel) {
    if (!message) {
      debug('empty notification ignored');
      return Promise.reject(new Error('EMPTY_MESSAGE'));
    }
    if (this.isDuplicateMessage(message)) {
      debug('DUPLICATE_MESSAGE');
      return Promise.reject(new Error('DUPLICATE_MESSAGE'));
    }
    const { queueSize, brainUri } = this;
    if (queueSize >= MAXIMAL_MESSAGE_QUEUE_SIZE) {
      debug('MAX_QUEUESIZE_REACHED', MAXIMAL_MESSAGE_QUEUE_SIZE);
      return Promise.reject(new Error('MAX_QUEUESIZE_REACHED'));
    }
    debug('POST: %o', message, brainUri);
    this.queueSize = queueSize + 1;
    return axios
      .post(brainUri, message, { httpAgent, timeout })
      .then(({ data }) => {
        this.updateCache(message);
        this.decreaseQueueSize();
        return data;
      })
      .catch(error => {
        debug('failed to send notification', error.message);
        this.decreaseQueueSize();
      });
  }
}
