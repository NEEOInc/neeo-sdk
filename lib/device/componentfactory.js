'use strict';

const debug = require('debug')('neeo:device:ComponentFactory');

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

const SENSOR_TYPE_ARRAY = 'array';
const SENSOR_TYPE_BINARY = 'binary';
const SENSOR_TYPE_CUSTOM = 'custom';
const SENSOR_TYPE_POWER = 'power';
const SENSOR_TYPE_RANGE = 'range';
const SENSOR_TYPE_STRING = 'string';
const SENSOR_SUFFIX = '_SENSOR';
const SENSOR_DEFAULT_TYPE = SENSOR_TYPE_RANGE;
const SENSOR_TYPES = [
  SENSOR_TYPE_ARRAY,
  SENSOR_TYPE_BINARY,
  SENSOR_TYPE_CUSTOM,
  SENSOR_TYPE_POWER,
  SENSOR_TYPE_RANGE,
  SENSOR_TYPE_STRING,
];

const SLIDER_TYPE_RANGE = 'range';
const SLIDER_DEFAULT_RANGE = [0, 100];
const SLIDER_DEFAULT_UNIT = '%';

const VALID_IMAGEURL_SIZES = [
  'small',
  'large',
];

module.exports = {
  SENSOR_TYPE_ARRAY,
  SENSOR_TYPE_BINARY,
  SENSOR_TYPE_CUSTOM,
  SENSOR_TYPE_RANGE,
  SENSOR_TYPE_POWER,
  SENSOR_TYPE_STRING,

  getPathPrefix,

  buildButton,
  buildDirectory,
  buildSwitch,
  buildSensor,
  buildRangeSlider,
  buildTextLabel,
  buildImageUrl,
  buildDiscovery,
  buildRegister,
  buildDeviceSubscription,
};

function getPathPrefix(deviceuid) {
  return `/device/${deviceuid}/`;
}

function buildButton(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_BUTTON,
    name,
    label: param.label || name,
    path,
  };
}

function buildDirectory(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const component = {
    type: TYPE_DIRECTORY,
    label: param.label,
    name,
    path,
  };

  if (param.isQueue) {
    component.isQueue = param.isQueue;
  }

  if (param.isRoot) {
    component.isRoot = param.isRoot;
  }

  if (param.identifier) {
    component.identifier = param.identifier;
  }

  return component;
}

function buildSwitch(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;

  return {
    type: TYPE_SWITCH,
    name,
    label: param.label,
    path,
    sensor: getSensorNameIfNeeded(name),
  };
}

function validateRange(_range) {
  const range = _range || SLIDER_DEFAULT_RANGE;
  if (!range || !Array.isArray(range)) {
    throw new Error(`INVALID_SLIDER_RANGE ${JSON.stringify(range)}, range must be an array`);
  }
  if (range.length !== 2 || typeof range[0] !== 'number' || typeof range[1] !== 'number') {
    throw new Error(`INVALID_SLIDER_RANGE: ${JSON.stringify(range)}, range must include 2 numbers`);
  }
  return range;
}

function buildPowerSensor(pathPrefix, param) {
  const component = buildSensorHelper(pathPrefix, param, SENSOR_TYPE_POWER);

  // Power state sensors are added by addPowerStateSensor with the name
  // powerstate, for backward compatibility we need to avoid changing it
  // to POWERSTATE_SENSOR.
  const legacyNoSuffixName = encodeURIComponent(param.name);
  component.name = legacyNoSuffixName;
  component.path = pathPrefix + legacyNoSuffixName;

  return component;
}

function buildSensor(pathPrefix, param) {
  if (param.type === SENSOR_TYPE_POWER) {
    return buildPowerSensor(pathPrefix, param);
  }
  else if (SENSOR_TYPES.includes(param.type)) {
    return buildSensorHelper(pathPrefix, param, param.type);
  }

  return buildLegacyFallbackSensor(pathPrefix, param);
}

function buildSensorHelper(pathPrefix, param, type = SENSOR_DEFAULT_TYPE) {
  validateParameter(pathPrefix, param);
  const name = getSensorNameIfNeeded(encodeURIComponent(param.name));
  const path = pathPrefix + name;
  const label = param.sensorlabel || param.label || param.name;

  if (type === SENSOR_TYPE_CUSTOM) {
    debug('Warning: sensor of type custom is not recommended.', param.name);
  }

  const component = {
    type: TYPE_SENSOR,
    name,
    label,
    path,
    sensor: {
      type,
    },
  };

  if (type === SENSOR_TYPE_RANGE) {
    component.sensor.range  = validateRange(param.range);
    component.sensor.unit = param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT;
  }

  return component;
}

function buildLegacyFallbackSensor(pathPrefix, param) {
  debug('Warning: no type for sensor %s, using default. ' +
    'This fallback will be removed in a future version.', param.name);
  const component = buildSensorHelper(pathPrefix, param, SENSOR_TYPE_RANGE);

  // To avoid breaking changes we keep the non standard no suffix name
  const legacyNoSuffixName = encodeURIComponent(param.name);
  component.name = legacyNoSuffixName;
  component.path = pathPrefix + legacyNoSuffixName;

  return component;
}

function buildRangeSlider(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const range = validateRange(param.range);
  const unit = param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT;

  return {
    type: TYPE_SLIDER,
    name,
    label: param.label || name,
    path,
    slider: {
      type: SLIDER_TYPE_RANGE,
      sensor: getSensorNameIfNeeded(name),
      range: range,
      unit,
    },
  };
}

function buildTextLabel(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_TEXTLABEL,
    name,
    label: param.label || name,
    path,
    sensor: getSensorNameIfNeeded(name),
    isLabelVisible: param.isLabelVisible,
  };
}

function validateImageSize(size) {
  if (!VALID_IMAGEURL_SIZES.includes(size)) {
    throw new Error('INVALID_IMAGEURL_SIZE');
  }
}

function buildImageUrl(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const imageUri = param.uri || null;

  const size = param.size || 'large';
  if (!param.size) {
    debug('warning, no size definition found for image, use large');
  }
  validateImageSize(size);

  return {
    type: TYPE_IMAGEURL,
    name,
    label: param.label || name,
    imageUri,
    size,
    path,
    sensor: getSensorNameIfNeeded(name),
  };
}

function validateParameter(pathPrefix, param) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  if (!param || !param.name) {
    throw new Error('INVALID_BUILD_PARAMETER');
  }
}

function buildDiscovery(pathPrefix) {
  return getRouteFor(pathPrefix, TYPE_DISCOVER_ROUTE);
}

function buildRegister(pathPrefix) {
  return getRouteFor(pathPrefix, TYPE_REGISTER_ROUTE);
}

function buildDeviceSubscription(pathPrefix) {
  return getRouteFor(pathPrefix, TYPE_DEVICE_SUBSCRIPTION_ROUTE);
}

function getRouteFor(pathPrefix, route) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }

  const path = pathPrefix + route;
  return {
    type: route,
    name: route,
    path,
  };
}

function getSensorNameIfNeeded(name) {
  const alreadySensorName = name.endsWith(SENSOR_SUFFIX);
  if (alreadySensorName) {
    return name;
  }
  return name.toUpperCase() + SENSOR_SUFFIX;
}
