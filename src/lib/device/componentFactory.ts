import * as Debug from 'debug';
import * as Models from '../models';

const debug = Debug('neeo:device:ComponentFactory');

// TODO declare types in models/components to use here and in requestHandler.
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
const TYPE_FAVORITE_HANDLER_ROUTE = 'favoritehandler';

export const SENSOR_TYPE_ARRAY = 'array';
export const SENSOR_TYPE_BINARY = 'binary';
export const SENSOR_TYPE_CUSTOM = 'custom';
export const SENSOR_TYPE_POWER = 'power';
export const SENSOR_TYPE_RANGE = 'range';
export const SENSOR_TYPE_STRING = 'string';

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

const VALID_IMAGEURL_SIZES = ['small', 'large'];

export function buildButton(
  pathPrefix: string,
  param: Models.ButtonDescriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const label = param.label ? encodeURIComponent(param.label) : name;

  return {
    type: TYPE_BUTTON,
    name,
    label,
    path,
  };
}

export function buildDirectory(
  pathPrefix: string,
  param: Models.Directory.Descriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;

  return {
    type: TYPE_DIRECTORY,
    label: encodeURIComponent(param.label || ''),
    name,
    path,
    role: param.role,
    identifier: param.identifier,
  };
}

export function buildSwitch(
  pathPrefix: string,
  param: Models.Descriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;

  return {
    type: TYPE_SWITCH,
    name,
    label: encodeURIComponent(param.label || ''),
    path,
    sensor: getSensorNameIfNeeded(name),
  };
}

function validateRange(param?: ReadonlyArray<number>) {
  const range = param || SLIDER_DEFAULT_RANGE;
  if (!range || !Array.isArray(range)) {
    throw new Error(`INVALID_SLIDER_RANGE ${JSON.stringify(range)}, range must be an array`);
  }
  if (range.length !== 2 || typeof range[0] !== 'number' || typeof range[1] !== 'number') {
    throw new Error(`INVALID_SLIDER_RANGE: ${JSON.stringify(range)}, range must include 2 numbers`);
  }

  return range;
}

function buildPowerSensor(
  pathPrefix: string,
  param: Models.Sensor.Descriptor
) {
  const component = buildSensorHelper(pathPrefix, param, SENSOR_TYPE_POWER);

  // Power state sensors are added by addPowerStateSensor with the name
  // powerstate, for backward compatibility we need to avoid changing it
  // to POWERSTATE_SENSOR.
  const legacyNoSuffixName = encodeURIComponent(param.name);
  component.name = legacyNoSuffixName;
  component.path = pathPrefix + legacyNoSuffixName;

  return component;
}

export function buildSensor(
  pathPrefix: string,
  param: Models.Sensor.Descriptor
) {
  if (param.type === SENSOR_TYPE_POWER) {
    return buildPowerSensor(pathPrefix, param);
  }

  if (param.type && SENSOR_TYPES.includes(param.type)) {
    return buildSensorHelper(pathPrefix, param, param.type);
  }

  return buildLegacyFallbackSensor(pathPrefix, param);
}

export function buildRangeSlider(
  pathPrefix: string,
  param: Models.Slider.Descriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const range = validateRange(param.range);
  const unit = param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT;
  const label = param.label ? encodeURIComponent(param.label) : name;

  return {
    type: TYPE_SLIDER,
    name,
    label,
    path,
    slider: {
      type: SLIDER_TYPE_RANGE,
      sensor: getSensorNameIfNeeded(name),
      range,
      unit,
    },
  };
}

function buildSensorHelper(
  pathPrefix: string,
  param: Models.Sensor.Descriptor,
  type = SENSOR_DEFAULT_TYPE
) {
  validateParameter(pathPrefix, param);
  const name = getSensorNameIfNeeded(encodeURIComponent(param.name));
  const path = pathPrefix + name;
  const label = encodeURIComponent(param.sensorlabel || param.label || param.name);

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
      ...(type === SENSOR_TYPE_RANGE
        ? {
            range: validateRange(param.range),
            unit: param.unit ? encodeURIComponent(param.unit) : SLIDER_DEFAULT_UNIT,
          }
        : {}),
    },
  };

  return component;
}

function buildLegacyFallbackSensor(pathPrefix: string, param: Models.Sensor.Descriptor) {
  debug(
    'Warning: no type for sensor %s, using default. ' +
      'This fallback will be removed in a future version.',
    param.name
  );
  const component = buildSensorHelper(pathPrefix, param, SENSOR_TYPE_RANGE);

  // To avoid breaking changes we keep the non standard no suffix name
  const legacyNoSuffixName = encodeURIComponent(param.name);
  component.name = legacyNoSuffixName;
  component.path = pathPrefix + legacyNoSuffixName;

  return component;
}

export function buildTextLabel(
  pathPrefix: string,
  param: Models.TextLabel.Descriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const label = param.label ? encodeURIComponent(param.label) : name;

  return {
    type: TYPE_TEXTLABEL,
    name,
    label,
    path,
    sensor: getSensorNameIfNeeded(name),
    isLabelVisible: param.isLabelVisible,
  };
}

function validateImageSize(size: string) {
  if (!VALID_IMAGEURL_SIZES.includes(size)) {
    throw new Error('INVALID_IMAGEURL_SIZE');
  }
}

export function buildImageUrl(
  pathPrefix: string,
  param: Models.Image.Descriptor
) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const imageUri = param.uri || null;
  const label = param.label ? encodeURIComponent(param.label) : name;

  const size = param.size || 'large';
  if (!param.size) {
    debug('warning, no size definition found for image, use large');
  }

  validateImageSize(size);

  return {
    type: TYPE_IMAGEURL,
    name,
    label,
    imageUri,
    size,
    path,
    sensor: getSensorNameIfNeeded(name),
  };
}

export function buildDiscovery(pathPrefix: string) {
  return getRouteFor(pathPrefix, TYPE_DISCOVER_ROUTE);
}

export function buildRegister(pathPrefix: string) {
  return getRouteFor(pathPrefix, TYPE_REGISTER_ROUTE);
}

export function buildDeviceSubscription(pathPrefix: string) {
  return getRouteFor(pathPrefix, TYPE_DEVICE_SUBSCRIPTION_ROUTE);
}

export function buildFavoritesHandler(pathPrefix: string) {
  return getRouteFor(pathPrefix, TYPE_FAVORITE_HANDLER_ROUTE);
}

function validateParameter(pathPrefix: string, param: { name: string }) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  if (!param || !param.name) {
    throw new Error('INVALID_BUILD_PARAMETER');
  }
}

function getRouteFor(pathPrefix: string, route: string) {
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

function getSensorNameIfNeeded(name: string) {
  const alreadySensorName = name.endsWith(SENSOR_SUFFIX);
  if (alreadySensorName) {
    return name;
  }

  return name.toUpperCase() + SENSOR_SUFFIX;
}
