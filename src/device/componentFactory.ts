import * as Debug from 'debug';
import * as Models from '../models';

const debug = Debug('neeo:device:ComponentFactory');

const TYPE_BUTTON = 'button';
const TYPE_SWITCH = 'switch';
const TYPE_SLIDER = 'slider';
const TYPE_SENSOR = 'sensor';
const TYPE_TEXTLABEL = 'textlabel';
const TYPE_IMAGEURL = 'imageurl';
const TYPE_DIRECTORY = 'directory';
const TYPE_DISCOVER_ROUTE = 'discover';
const TYPE_REGISTER_ROUTE = 'register';
const TYPE_DEVICE_SUBSCRIPTION_ROUTE = 'devicesubscription';

const TYPE_SENSOR_CUSTOM = 'custom';
const TYPE_SENSOR_RANGE = 'range';
const TYPE_SLIDER_RANGE = 'range';
const TYPE_SENSOR_BINARY = 'binary';
const TYPE_SENSOR_POWER = 'power';
const SENSOR_SUFFIX = '_SENSOR';

const DEFAULT_SLIDER_RANGE = [0, 100];
const DEFAULT_SLIDER_UNIT = '%';

const VALID_IMAGEURL_SIZES = ['small', 'large'];

function validateParameter(pathPrefix: string, param: { name: string }) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  if (!param || !param.name) {
    throw new Error('INVALID_BUILD_PARAMETER');
  }
}

export function buildPathPrefix(adapterName: string, deviceUid: string) {
  return `/device/${deviceUid}/`;
}

export function buildButton(
  pathPrefix: string,
  param: Models.ButtonDescriptor
): Models.UIComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_BUTTON,
    name,
    label: param.label || name,
    path
  };
}

export function buildDirectory(
  pathPrefix: string,
  param: Models.DirectoryDescriptor
): Models.DirectoryComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_DIRECTORY,
    label: param.label,
    name,
    path,
    isQueue: param.isQueue,
    isRoot: param.isRoot,
    identifier: param.identifier
  };
}

function buildSensorName(name: string) {
  return name.toUpperCase() + SENSOR_SUFFIX;
}

export function buildSwitch(
  pathPrefix: string,
  param: Models.SwitchDescriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  //TODO validate, check sensor is of type binary
  return {
    type: TYPE_SWITCH,
    name,
    label: param.label || name,
    path,
    sensor: buildSensorName(name)
  };
}

export function buildSwitchSensor(
  pathPrefix: string,
  param: Models.Descriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;

  //TODO validate
  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label:
      (param as { sensorlabel?: string }).sensorlabel || param.label || name,
    path,
    sensor: {
      type: TYPE_SENSOR_BINARY
    }
  };
}

function validateRange(param?: ReadonlyArray<number>) {
  const range = param || DEFAULT_SLIDER_RANGE;
  if (!range || !Array.isArray(range)) {
    throw new Error('INVALID_SLIDER_RANGE');
  }
  if (
    range.length !== 2 ||
    typeof range[0] !== 'number' ||
    typeof range[1] !== 'number'
  ) {
    throw new Error('INVALID_SLIDER_RANGE');
  }
  return range;
}

export function buildRangeSliderSensor(
  pathPrefix: string,
  param: Models.SliderDescriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;
  const range = validateRange(param.range);
  const unit = param.unit
    ? encodeURIComponent(param.unit)
    : DEFAULT_SLIDER_UNIT;

  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label:
      (param as { sensorlabel?: string }).sensorlabel || param.label || name,
    path,
    sensor: {
      type: TYPE_SENSOR_RANGE,
      range: range,
      unit
    }
  };
}

function buildRangeSensor(
  pathPrefix: string,
  param: Models.SensorDescriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const range = validateRange(param.range);
  const unit = param.unit
    ? encodeURIComponent(param.unit)
    : DEFAULT_SLIDER_UNIT;

  return {
    type: TYPE_SENSOR,
    name: name,
    label: param.label || param.name,
    path,
    sensor: {
      type: TYPE_SENSOR_RANGE,
      range: range,
      unit
    }
  };
}

function buildPowerSensor(
  pathPrefix: string,
  param: Models.SensorDescriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;

  return {
    type: TYPE_SENSOR,
    name: name,
    label: param.label || param.name,
    path,
    sensor: {
      type: TYPE_SENSOR_POWER
    }
  };
}

export function buildSensor(
  pathPrefix: string,
  param: Models.SensorDescriptor
): Models.SensorComponent {
  if (param.type === TYPE_SENSOR_POWER) {
    return buildPowerSensor(pathPrefix, param);
  }
  return buildRangeSensor(pathPrefix, param);
}

export function buildRangeSlider(
  pathPrefix: string,
  param: Models.SliderDescriptor
): Models.SliderComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const range = validateRange(param.range);
  const unit = param.unit
    ? encodeURIComponent(param.unit)
    : DEFAULT_SLIDER_UNIT;

  return {
    type: TYPE_SLIDER,
    name,
    label: param.label || name,
    path,
    slider: {
      type: TYPE_SLIDER_RANGE,
      sensor: buildSensorName(name),
      range,
      unit
    }
  };
}

export function buildTextLabel(
  pathPrefix: string,
  param: Models.TextLabelDescriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_TEXTLABEL,
    name,
    label: param.label || name,
    path,
    sensor: buildSensorName(name)
  };
}

export function buildImageUrl(
  pathPrefix: string,
  param: Models.ImageDescriptor
): Models.ImageComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const imageUri = param.uri || null;

  const size = param.size || 'large';
  if (!param.size) {
    debug('warning, no size definition found for image, use large');
  }
  if (!VALID_IMAGEURL_SIZES.includes(size)) {
    throw new Error('INVALID_IMAGEURL_SIZE');
  }

  return {
    type: TYPE_IMAGEURL,
    name,
    label: param.label || name,
    imageUri,
    size,
    path,
    sensor: buildSensorName(name)
  };
}

export function buildCustomSensor(
  pathPrefix: string,
  param: Models.Descriptor
): Models.SensorComponent {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;

  //TODO validate
  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label:
      (param as { sensorlabel?: string }).sensorlabel || param.label || name,
    path,
    sensor: {
      type: TYPE_SENSOR_CUSTOM
    }
  };
}

export function buildDiscovery(pathPrefix: string): Models.DiscoveryComponent {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  const path = pathPrefix + TYPE_DISCOVER_ROUTE;
  return {
    type: TYPE_DISCOVER_ROUTE,
    name: TYPE_DISCOVER_ROUTE,
    path
  };
}

export function buildRegister(
  pathPrefix: string
): Models.RegistrationComponent {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  const path = pathPrefix + TYPE_REGISTER_ROUTE;
  return {
    type: TYPE_REGISTER_ROUTE,
    name: TYPE_REGISTER_ROUTE,
    path
  };
}

export function buildDeviceSubscription(
  pathPrefix: string
): Models.SubscriptionComponent {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  const path = pathPrefix + TYPE_DEVICE_SUBSCRIPTION_ROUTE;
  return {
    type: TYPE_DEVICE_SUBSCRIPTION_ROUTE,
    name: TYPE_DEVICE_SUBSCRIPTION_ROUTE,
    path
  };
}
