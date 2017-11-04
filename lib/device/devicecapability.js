'use strict';

const ComponentFactory = require('./componentfactory');
const debug = require('debug')('neeo:device:DeviceCapability');

class DeviceCapability {

  constructor(data, adapterName) {
    this.buttons = data.buttons;
    this.sliders = data.sliders;
    this.switches = data.switches;
    this.textLabels = data.textLabels;
    this.imageUrls = data.imageUrls;
    this.sensors = data.sensors;
    this.discovery = data.discovery;
    this.deviceidentifier = data.deviceidentifier;
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
    debug('register capability', capability.type, capability.path, controller);
    if (this._isUniquePath(capability.path)) {
      this.capabilities.push(capability);
      this.handlerMap.set(decodeURIComponent(capability.name), { componenttype: capability.type, controller });
      return this;
    }
    debug('path is not unique', capability.name, capability.type, capability.path);
    throw new Error('DUPLICATE_PATH_DETECTED');
  }

  _addRouteHandler(capability, controller) {
    debug('register route', capability.type, capability.path);
    if (this._isUniquePath(capability.path)) {
      this.handlerMap.set(decodeURIComponent(capability.name), { componenttype: capability.type, controller });
      return this;
    }
    debug('path is not unique', capability.name, capability.type, capability.path);
    throw new Error('DUPLICATE_PATH_DETECTED');
  }

  build() {
    const pathPrefix = ComponentFactory.buildPathPrefix(this.adapterName, this.deviceidentifier);

    this.buttons.forEach((button) => {
      const actor = ComponentFactory.buildButton(pathPrefix, button.param);
      this._addCapability(actor, button.controller);
    });

    this.sliders.forEach((slider) => {
      const sensor = ComponentFactory.buildRangeSliderSensor(pathPrefix, slider.param);
      this._addCapability(sensor, slider.controller);
      const actor = ComponentFactory.buildRangeSlider(pathPrefix, slider.param);
      this._addCapability(actor, slider.controller);
    });

    this.switches.forEach((onOff) => {
      const sensor = ComponentFactory.buildSwitchSensor(pathPrefix, onOff.param);
      this._addCapability(sensor, onOff.controller);
      const actor = ComponentFactory.buildSwitch(pathPrefix, onOff.param);
      this._addCapability(actor, onOff.controller);
    });

    this.textLabels.forEach((textLabel) => {
      const sensor = ComponentFactory.buildCustomSensor(pathPrefix, textLabel.param);
      this._addCapability(sensor, textLabel.controller);
      const actor = ComponentFactory.buildTextLabel(pathPrefix, textLabel.param);
      this._addCapability(actor, textLabel.controller);
    });

    this.imageUrls.forEach((imageUrl) => {
      const sensor = ComponentFactory.buildCustomSensor(pathPrefix, imageUrl.param);
      this._addCapability(sensor, imageUrl.controller);
      const actor = ComponentFactory.buildImageUrl(pathPrefix, imageUrl.param);
      this._addCapability(actor, imageUrl.controller);
    });

    this.sensors.forEach((_sensor) => {
      const sensor = ComponentFactory.buildSensor(pathPrefix, _sensor.param);
      this._addCapability(sensor, _sensor.controller);
    });

    this.discovery.forEach((discovery) => {
      const element = ComponentFactory.buildDiscovery(pathPrefix);
      this._addRouteHandler(element, discovery.controller);
    });

    return {
      capabilities: this.capabilities,
      handlers: this.handlerMap
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
