import axios from 'axios';
import * as Debug from 'debug';
import * as http from 'http';
import * as Models from '../../models';

const httpAgent = new http.Agent({
  maxSockets: 1,
  keepAlive: true,
  keepAliveMsecs: 16000,
});
const debug = Debug('neeo:device:brain:BrainNotification');

const MAXIMAL_CACHED_ENTRIES = 80;
const MAXIMAL_MESSAGE_QUEUE_SIZE = 20;
const timeout = 8000;

const DEVICE_SENSOR_UPDATE_TYPE = 'DEVICE_SENSOR_UPDATE';

export default class {
  private queueSize: number;
  private readonly brainUri: string;
  private readonly sensorValues: Map<
    string,
    Models.SensorDescriptor.SensorValue
  >;

  constructor(options: { url: string }) {
    debug('init', options);
    this.queueSize = 0;
    this.brainUri = `${options.url}/v1/notifications`;
    this.sensorValues = new Map();
  }

  public send(message: Models.MessageModel) {
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
    this.queueSize++;

    return axios
      .post(brainUri, message, { httpAgent, timeout })
      .then(({ data }) => {
        this.updateCache(message);
        this.decreaseQueueSize();
        return data;
      })
      .catch((error) => {
        debug('failed to send notification', error.message);
        this.decreaseQueueSize();
      });
  }

  private decreaseQueueSize() {
    if (this.queueSize > 0) {
      this.queueSize--;
    }
  }

  private isDuplicateMessage(message: Models.MessageModel) {
    if (this.empty(message)) {
      return false;
    }
    const { type, data } = this.extractTypeAndData(message);
    const lastSensorValue = this.sensorValues.get(type);

    return lastSensorValue === data;
  }

  private updateCache(message: Models.MessageModel) {
    if (this.empty(message)) {
      return;
    }
    const { type, data } = this.extractTypeAndData(message);
    const { sensorValues } = this;
    if (sensorValues.size > MAXIMAL_CACHED_ENTRIES) {
      debug('clear message cache');
      this.sensorValues.clear();
    }
    sensorValues.set(type, data);
  }

  private empty(message: Models.MessageModel) {
    return !message || !message.type || typeof message.data === 'undefined';
  }

  private extractTypeAndData(message: Models.MessageModel) {
    if (message.type === DEVICE_SENSOR_UPDATE_TYPE) {
      const { data } = message;

      return { type: data.sensorEventKey, data: data.sensorValue };
    }

    return { type: message.type, data: message.data };
  }
}
