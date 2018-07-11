'use strict';

const ComponentFactory = require('./componentfactory');
const debug = require('debug')('neeo:device:DeviceCapability');

const CAPABILITIES_REQUIRING_DISCOVERY = [
  'bridgeDevice',
  'addAnotherDevice',
];

class DeviceCapability {

  constructor(data, adapterName) {
    this.buttons = data.buttons;
    this.sliders = data.sliders;
    this.switches = data.switches;
    this.textLabels = data.textLabels;
    this.imageUrls = data.imageUrls;
    this.sensors = data.sensors;
    this.directories = data.directories;
    this.discovery = data.discovery;
    this.registration = data.registration;
    this.deviceSubscriptionHandlers = data.deviceSubscriptionHandlers;
    this.deviceidentifier = data.deviceidentifier;
    this.deviceCapabilities = data.deviceCapabilities;
    this.devicename = data.devicename;
    this.adapterName = adapterName;
    this.capabilities = [];
    this.handlerMap = new Map();
  }

  _isUniquePath(path) {
    return undefined === this.capabilities.find((element) => {
      return element.path === path;
    });
  }

  _addCapability(capability, controller) {
    debug('register capability', this.devicename, capability.type, capability.path);
    if (this._isUniquePath(capability.path)) {
      this.capabilities.push(capability);
      this.handlerMap.set(decodeURIComponent(capability.name), { componenttype: capability.type, controller });
      return this;
    }
    debug('path is not unique', capability.name, capability.type, capability.path);
    throw new Error(`DUPLICATE_PATH_DETECTED: ${capability.name}`);
  }

  _addRouteHandler(capability, controller) {
    debug('register route', capability.type, capability.path);
    if (this._isUniquePath(capability.path)) {
      this.handlerMap.set(decodeURIComponent(capability.name), { componenttype: capability.type, controller });
      return this;
    }
    debug('path is not unique', capability.name, capability.type, capability.path);
    throw new Error(`DUPLICATE_PATH_DETECTED: ${capability.name}`);
  }

  build() {
    // TODO build the component factory itself with the prefix, this would avoid
    // passing the pathPrefix to every buildCall.
    const pathPrefix = ComponentFactory.getPathPrefix(this.deviceidentifier);

    this.buttons.forEach((button) => {
      const actor = ComponentFactory.buildButton(pathPrefix, button.param);
      this._addCapability(actor, button.controller);
    });

    this.sliders.forEach((slider) => {
      slider.param.type = ComponentFactory.SENSOR_TYPE_RANGE;
      const sensor = ComponentFactory.buildSensor(pathPrefix, slider.param);
      this._addCapability(sensor, slider.controller);
      const actor = ComponentFactory.buildRangeSlider(pathPrefix, slider.param);
      this._addCapability(actor, slider.controller);
    });

    this.switches.forEach((onOff) => {
      onOff.param.type = ComponentFactory.SENSOR_TYPE_BINARY;
      const sensor = ComponentFactory.buildSensor(pathPrefix, onOff.param);
      this._addCapability(sensor, onOff.controller);
      const actor = ComponentFactory.buildSwitch(pathPrefix, onOff.param);
      this._addCapability(actor, onOff.controller);
    });

    this.textLabels.forEach((textLabel) => {
      textLabel.param.type = ComponentFactory.SENSOR_TYPE_STRING;
      const sensor = ComponentFactory.buildSensor(pathPrefix, textLabel.param);
      this._addCapability(sensor, textLabel.controller);
      const actor = ComponentFactory.buildTextLabel(pathPrefix, textLabel.param);
      this._addCapability(actor, textLabel.controller);
    });

    this.imageUrls.forEach((imageUrl) => {
      imageUrl.param.type = ComponentFactory.SENSOR_TYPE_STRING;
      const sensor = ComponentFactory.buildSensor(pathPrefix, imageUrl.param);
      this._addCapability(sensor, imageUrl.controller);
      const actor = ComponentFactory.buildImageUrl(pathPrefix, imageUrl.param);
      this._addCapability(actor, imageUrl.controller);
    });

    this.sensors.forEach((_sensor) => {
      const sensor = ComponentFactory.buildSensor(pathPrefix, _sensor.param);
      this._addCapability(sensor, _sensor.controller);
    });

    this.directories.forEach((_directory) => {
      const directory = ComponentFactory.buildDirectory(pathPrefix, _directory.param);
      this._addCapability(directory, _directory.controller);
    });

    let noDiscovery = true;

    this.discovery.forEach((discovery) => {
      const element = ComponentFactory.buildDiscovery(pathPrefix);
      this._addRouteHandler(element, discovery.controller);
      noDiscovery = false;
    });

    const discoveryRequired = CAPABILITIES_REQUIRING_DISCOVERY
      .some((capability) =>  this.deviceCapabilities.includes(capability));

    if (discoveryRequired && noDiscovery) {
      throw new Error('DISCOVERY_REQUIRED addAnotherDevice and bridgeDevice require discovery');
    }

    this.registration.forEach((register) => {
      const element = ComponentFactory.buildRegister(pathPrefix);
      this._addRouteHandler(element, register.controller);
    });

    if (this.deviceSubscriptionHandlers) {
      const element = ComponentFactory.buildDeviceSubscription(pathPrefix);
      this._addRouteHandler(element, this.deviceSubscriptionHandlers);
    }

    return {
      capabilities: this.capabilities,
      handlers: this.handlerMap,
    };
  }
}


module.exports.build = function(data, adapterName) {
  if (!data || typeof adapterName !== 'string') {
    throw new Error('INVALID_PARAMETERS');
  }

  const capabilities = new DeviceCapability(data, adapterName);
  return capabilities.build();
};
