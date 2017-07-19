'use strict';

const TYPE_BUTTON = 'button';
const TYPE_SWITCH = 'switch';
const TYPE_SLIDER = 'slider';
const TYPE_SENSOR = 'sensor';
const TYPE_TEXTLABEL = 'textlabel';
const TYPE_IMAGEURL = 'imageurl';
const TYPE_DISCOVER_ROUTE = 'discover';

const TYPE_SENSOR_CUSTOM = 'custom';
const TYPE_SENSOR_RANGE = 'range';
const TYPE_SLIDER_RANGE = 'range';
const TYPE_SENSOR_BINARY = 'binary';
const SENSOR_SUFFIX = '_SENSOR';

const DEFAULT_SLIDER_RANGE = [0, 100];
const DEFAULT_SLIDER_UNIT = '%';

function validateParameter(pathPrefix, param) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  if (!param || !param.name) {
    throw new Error('INVALID_BUILD_PARAMETER');
  }
}

module.exports.buildPathPrefix = function(adaptername, deviceuid) {
  return `/device/${deviceuid}/`;
};

module.exports.buildButton = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  return {
    type: TYPE_BUTTON,
    name,
    label: param.label || name,
    path,
  };
};

function buildSensorName(name) {
  return name.toUpperCase() + SENSOR_SUFFIX;
}

module.exports.buildSwitch = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  //TODO validate, check sensor is of type binary
  return {
    type: TYPE_SWITCH,
    name,
    label: param.label,
    path,
    sensor: buildSensorName(name)
  };
};

module.exports.buildSwitchSensor = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;

  //TODO validate
  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label: param.sensorlabel || param.label,
    path,
    sensor: {
      type: TYPE_SENSOR_BINARY,
    }
  };
};


function validateRange(_range) {
  const range = _range || DEFAULT_SLIDER_RANGE;
  if (!range && !Array.isArray(range)) {
    throw new Error('INVALID_SLIDER_RANGE');
  }
  if (range.length !== 2 || typeof range[0] !== 'number' || typeof range[1] !== 'number') {
    throw new Error('INVALID_SLIDER_RANGE');
  }
  return range;
}

module.exports.buildRangerSliderSensor = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;
  const range = validateRange(param.range);

  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label: param.sensorlabel || param.label,
    path,
    sensor: {
      type: TYPE_SENSOR_RANGE,
      range: range,
      unit: param.unit || DEFAULT_SLIDER_UNIT
    }
  };
};


module.exports.buildRangeSlider = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const range = validateRange(param.range);

  return {
    type: TYPE_SLIDER,
    name,
    label: param.label || name,
    path,
    slider: {
      type: TYPE_SLIDER_RANGE,
      sensor: buildSensorName(name),
      range: range,
      unit: param.unit || DEFAULT_SLIDER_UNIT
    }
  };
};

module.exports.buildTextLabel = function(pathPrefix, param) {
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
};

module.exports.buildImageUrl = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const path = pathPrefix + name;
  const imageUri = param.uri || null;
  const size = param.size || 'large';
  return {
    type: TYPE_IMAGEURL,
    name,
    label: param.label || name,
    imageUri,
    size,
    path,
    sensor: buildSensorName(name),
  };
};

module.exports.buildCustomSensor = function(pathPrefix, param) {
  validateParameter(pathPrefix, param);
  const name = encodeURIComponent(param.name);
  const sensorName = buildSensorName(name);
  const path = pathPrefix + sensorName;

  //TODO validate
  return {
    type: TYPE_SENSOR,
    name: sensorName,
    label: param.sensorlabel || param.label,
    path,
    sensor: {
      type: TYPE_SENSOR_CUSTOM,
    }
  };
};



module.exports.buildDiscovery = function(pathPrefix) {
  if (!pathPrefix) {
    throw new Error('INVALID_PATHPREFIX');
  }
  const path = pathPrefix + TYPE_DISCOVER_ROUTE;
  return {
    type: TYPE_DISCOVER_ROUTE,
    name: TYPE_DISCOVER_ROUTE,
    path
  };
};
