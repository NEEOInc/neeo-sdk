import * as BluePromise from 'bluebird';
import * as Debug from 'debug';
import config from '../../config';
import * as Models from '../../models';
import BrainDeviceSubscriptions from './deviceSubscriptions';
import BrainNotification from './notification';
import BrainNotificationMapping from './notificationMapping';
import * as BrainRegister from './register';
import buildBrainUrl from './urlBuilder';

const debug = Debug('neeo:device:brain:BrainIndex');

let brainNotification: BrainNotification | undefined;
let brainNotificationMapping: BrainNotificationMapping | undefined;
let brainDeviceSubscriptions: BrainDeviceSubscriptions | undefined;

export function start(conf: {
  brain: Models.BrainModel | string;
  brainport?: number;
  adapterName: string;
  baseUrl: string;
}) {
  const { brainport, baseUrl } = conf;
  const brainConfig = {
    url: buildBrainUrl(conf.brain, undefined, brainport),
    baseUrl,
    adapterName: conf.adapterName,
  };
  brainDeviceSubscriptions = BrainDeviceSubscriptions.build(brainConfig);
  brainNotification = new BrainNotification(brainConfig);
  brainNotificationMapping = new BrainNotificationMapping(brainConfig);

  return BrainRegister.registerAdapterOnTheBrain(brainConfig);
}

export function stop(conf: { brain: Models.BrainModel | string; adapterName: string }) {
  if (!conf) {
    return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
  }
  const { brain, adapterName } = conf;
  if (!brain || !adapterName) {
    return Promise.reject(new Error('BRAIN_INVALID_PARAMETER_UNREGISTER'));
  }
  const urlPrefix = buildBrainUrl(brain);
  brainNotification = undefined;
  brainNotificationMapping = undefined;
  return BrainRegister.unregisterAdapterOnTheBrain({
    url: urlPrefix,
    adapterName,
  });
}

export function sendNotification(msg: Models.MessageModel, deviceId: string) {
  return sendBrainNotification(msg, deviceId);
}

export function sendSensorNotification(msg: Models.MessageModel, deviceId: string) {
  return sendBrainNotification(msg, deviceId, config.sensorUpdateKey);
}

export function getSubscriptions(deviceId: string) {
  return brainDeviceSubscriptions
    ? brainDeviceSubscriptions.getSubscriptions(deviceId)
    : Promise.reject('Not started');
}

function sendBrainNotification(msg: Models.MessageModel, deviceId: string, overrideKey?: string) {
  if (!brainNotification || !brainNotificationMapping) {
    debug('server not started, ignore notification');
    return Promise.reject(new Error('SERVER_NOT_STARTED'));
  }
  if (
    !deviceId ||
    !msg ||
    !msg.uniqueDeviceId ||
    !msg.component ||
    typeof msg.value === 'undefined'
  ) {
    debug('INVALID_NOTIFICATION_DATA %o', msg);
    return Promise.reject(new Error('INVALID_NOTIFICATION_DATA'));
  }

  if (msg.raw) {
    return brainNotification.send(msg);
  }

  return brainNotificationMapping
    .getNotificationKeys(msg.uniqueDeviceId, deviceId, msg.component)
    .then((notificationKeys) => {
      debug('notificationKeys %o', notificationKeys);
      const notificationPromises = notificationKeys.map((notificationKey) => {
        const notificationData = formatNotification(msg.value, notificationKey, overrideKey);

        return brainNotification && brainNotification.send(notificationData);
      });

      return BluePromise.all(notificationPromises);
    });
}

function formatNotification(data: any, notificationKey: string, overrideKey?: string) {
  if (overrideKey) {
    return {
      type: overrideKey,
      data: {
        sensorEventKey: notificationKey,
        sensorValue: data,
      },
    };
  }

  return { type: notificationKey, data };
}
