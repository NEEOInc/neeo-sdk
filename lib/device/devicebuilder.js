'use strict';

const DeviceType = require('./devicetype');
const DeviceCapability = require('./devicecapability');
const uniqueName = require('./uniqueName.js');
const buttongroup = require('./buttongroup.js');
const debug = require('debug')('neeo:device:DeviceBuilder');

const DEFAULT_MANUFACTURER = 'NEEO';
const DEFAULT_TYPE = 'ACCESSOIRE';
const API_VERSION = '1.0';

/**
 * @module Devicebuilder
 * @description Factory method to build a custom device.
 * @example
 *  neeoapi.buildDevice('simpleDevice1')
 *    .setManufacturer('NEEO')
 *    .addAdditionalSearchToken('foo')
 *    .setType('light')
 *    .addButton({ name: 'example-button', label: 'my button' }, controller.button)
 *    .addSwitch({ name: 'example-switch', label: 'my switch' },
 *      { setter: controller.switchSet, getter: controller.switchGet })
 *    .addSlider({ name: 'example-slider', label: 'my slider', range: [0,110], unit: '%' },
 *      { setter: controller.sliderSet, getter: controller.sliderGet });
 *
 */

/** */ // avoid doxdox thinking the @module above is for this function.
const deviceBuilder = class DeviceBuilder {
  constructor(name, uniqeString) {
    this.deviceidentifier = 'apt-' + uniqueName(name, uniqeString);
    this.manufacturer = DEFAULT_MANUFACTURER;
    this.type = DEFAULT_TYPE;
    this.devicename = name;
    this.additionalSearchTokens = [];
    this.buttonhandler = undefined;
    this.buttons = [];
    this.sliders = [];
    this.textLabels = [];
    this.switches = [];
    this.discovery = [];
    this.setup = {};
  }

  /**
   * @function setManufacturer
   * @param {string} manufacturerName used to find and add the device in the NEEO app.
   * @description Optional parameter to set the device manufacturer. Default manufacturer is NEEO
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setManufacturer('NEEO')
   */
  setManufacturer(manufacturer) {
    this.manufacturer = manufacturer;
    return this;
  }

  /**
   * @function setType
   * @param {string} type supported device classes, either 'ACCESSOIRE', 'LIGHT' or 'MEDIAPLAYER'
   * @description Optional parameter to define the device type. Default type is ACCESSOIRE. It is used to determine the display style and wiring suggestions in the NEEO app. Please note, ACCESSOIRE devices do not generate a view but can be used in other views as shortcut.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setType('light')
   */
  setType(type) {
    this.type = DeviceType.getDeviceType(type);
    return this;
  }

  /**
   * @function addAdditionalSearchToken
   * @param {string} token additional search keyword
   * @description Optional parameter define additional search tokens the user can enter in the NEEO App "Add Device" section.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * neeoapi.buildDevice('My Device Name')
   *        .addAdditionalSearchToken('MDN')
   */
  addAdditionalSearchToken(token) {
    this.additionalSearchTokens.push(token);
    return this;
  }

  build(adapterName) {
    if (!adapterName) {
      throw new Error('MISSING_ADAPTERNAME');
    }
    if (this.buttons.length > 0 && !this.buttonhandler) {
      throw new Error('BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED');
    }

    this.buttons = this.buttons.map((button) => {
      const boundFunction = this.buttonhandler.bind(null, button.param.name);
      return { param: button.param, controller: boundFunction };
    });

    const deviceCapability = DeviceCapability.build(this, adapterName);
    const capabilities = deviceCapability.capabilities;
    const handlers = deviceCapability.handlers;

    if (capabilities.length === 0) {
      throw new Error('INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES');
    }

    return {
      adapterName: this.deviceidentifier,
      apiversion: API_VERSION,
      type: this.type,
      manufacturer: this.manufacturer,
      setup: this.setup,
      devices: [{
        name: this.devicename,
        tokens: this.additionalSearchTokens
      }],
      capabilities: capabilities,
      handler: handlers,
      subscriptionFunction: this.subscriptionFunction
    };
  }

  /**
   * @function enableDiscovery
   * @param {object} messages An object which contains (optional)
   * **headerText** and **description**, this text will be displayed before the user starts the discovery process
   * @param {function} controller Callback function which will be called when the NEEO brain search your device.
   * This function should return an array of found devices, each object with an **id** attribute (unique device identifier, for example mac address), **name** the display name and the optional **readchable** attribute (true: device is reachable, false: device is not reachable)
   * @description Register a discovery function for your device. This function can be only defined once per device definition.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .enableDiscovery(
   *   {
   *     headerText: 'HELLO HEADER',
   *     description: 'ADD SOME ADDITIONAL INFORMATION HOW TO PREPARE YOUR DEVICE'
   *   },
   *   function() {
   *    return [
   *      {
   *        id: 'unique-device-id-001',
   *        name: 'first device',
   *      },
   *      {
   *        id: 'unique-device-id-002',
   *        name: 'second device, but not reachable',
   *        reachable: false
   *      }
   *    ];
   *   }
   * )
   */
  enableDiscovery(messages, controller) {
    debug('enable discovery %o', messages);
    if (typeof controller !== 'function') {
      throw new Error('INVALID_DISCOVERY_FUNCTION');
    }
    if (!messages || !messages.headerText || !messages.description) {
      throw new Error('INVALID_DISCOVERY_PARAMETER');
    }
    if (this.setup.discovery) {
      throw new Error('DISCOVERHANLDER_ALREADY_DEFINED');
    }
    this.setup = {
      discovery: true,
      registration: false,
      introheader: messages.headerText,
      introtext: messages.description,
    };
    this.discovery.push({ controller });
    return this;
  }

  /**
   * @function registerSubscriptionFunction
   * @param {function} controller Callback function which will be called when the NEEO SDK Server starts, to register a callback function
   * @description This is used for devices which need to send dynamic value updates (for switches or sliders) to the Brain they are registered on.
   * When the device is added to a Brain the SDK will call the controller function with an update function as argument. This function can be used to then send updates to the Brain when the value of the device updates.
   * For example a device with a physical slider can use this to keep the digital slider in sync. . This function can be only defined once per device definition.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * let updateCallbackReference;
   * deviceBuilder.registerSubscriptionFunction(function(updateCallback) {
   *   updateCallbackReference = updateCallback;
   * });
   *
   * // Update sensor at some later point
   * if (updateCallbackReference) {
   *   sendComponentUpdate({
   *     uniqueDeviceId: uniqueDeviceId,
   *     component: nameOfDeviceComponent, // slider or switch
   *     value: updatedSensorValue
   *   });
   * }
   */
  registerSubscriptionFunction(controller) {
    debug('get subscription function');
    if (typeof controller !== 'function') {
      throw new Error('INVALID_SUBSCRIPTION_CONTROLLER');
    }
    if (this.subscriptionFunction) {
      throw new Error('SUBSCRIPTIONHANLDER_ALREADY_DEFINED');
    }
    this.subscriptionFunction = controller;
    return this;
  }

  /**
   * @function addButton
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote)
   * @description Add a button for this device, can be called multiple times for multiple buttons. addButton can be combined with addButtonGroups. You need to be call the addButtonHandler function.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButton({ name: 'power-on', label: 'Power On' })
   * .addButton({ name: 'power-off', label: 'Power Off' })
   * .addButtonHander((deviceid, name) => {
   *   // handle button events here
   * })
   */
  addButton(param) {
    debug('add button %o', param);
    this.buttons.push({ param });
    return this;
  }

  /**
   * @function addButtonGroup
   * @param {object} name A button name group
   * @description Add multiple buttons defined by the button group name. The UI elements on the NEEO Brain are build automatically depending on the existing buttons of a device. You can add multiple ButtonGroups to a device and you can combine ButtonGroups with addButton calls. You need to be call the addButtonHandler function.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButtonGroup('Numpad')
   * .addButtonHander((deviceid, name) => {
   *   // handle button events here
   * })
   */
  addButtonGroup(name) {
    debug('add buttongroup with name', name);
    const buttonGroup = buttongroup.get(name);
    if (Array.isArray(buttonGroup)) {
      buttonGroup.forEach((button) => {
        this.addButton({ name: button });
      });
    }
    return this;
  }

  /**
   * @function addButtonHander
   * @param {function} controller Callback function which will be called one of the registered button triggered from the Brain.
   * @description Handles the events for all the registered buttons. This function can be only defined once per device definition and MUST be defined if you have added at least one button.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButtonHander((deviceid, name) => {
   *    if (name === 'power-on') {
   *      // Power on
   *    } else {
   *      // Power off
   *    }
   * });
   */
  addButtonHander(controller) {
    debug('add buttonhandler');
    if (typeof controller !== 'function') {
      throw new Error('MISSING_BUTTON_CONTROLLER_PARAMETER');
    }
    if (this.buttonhandler) {
      throw new Error('BUTTONHANDLER_ALREADY_DEFINED');
    }
    this.buttonhandler = controller;
    return this;
  }

  /**
   * @function addSlider
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote), **range** (optional, custom range of slider, default 0..100), **unit** (optional, custin slider unit, default %)
   * @param {object} controller An object which contains a getter and setter callback function.
   * @description Add a (range) slider to your custom device
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .addSlider(
   *   { name: 'example-slider', label: 'my slider', range: [0,200], unit: '%' },
   *   { setter: (newValue) => sensorValue = newValue, getter: () => sensorValue ) }
   * )
   */
  addSlider(param, controller) {
    debug('add slider %o', param);
    if (!controller || typeof controller.setter !== 'function' || typeof controller.getter !== 'function') {
      throw new Error('INVALID_SLIDER_CONTROLLER');
    }
    this.sliders.push({ param, controller });
    return this;
  }

  /**
   * @function addSwitch
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote)
   * @param {object} controller An object which contains a getter and setter callback function.
   * @description Add a (binary) switch to your custom element
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addSwitch(
   *   { name: 'example-switch', label: 'my switch' },
   *   { setter: (newValue) => switchState = newValue, getter: () => switchState ) }
   *  )
   */
  addSwitch(param, controller) {
    debug('add switch %o', param);
    if (!controller || typeof controller.setter !== 'function' || typeof controller.getter !== 'function') {
      throw new Error('INVALID_SWITCH_CONTROLLER');
    }
    this.switches.push({ param, controller });
    return this;
  }

  /**
   * @function addTextLabel
   * @param {object} param An object which contains **name** (identifier of this element), **label** (text label content)
   * @param {object} controller An object which returns the content of the text label.
   * @description Add a text label to your custom element (for example to display the current artist)
   * @return {object} DeviceBuilder
   * @example
   * .addTextLabel(
   *   { name: 'artistname', label: 'Artist name' },
   *   { controller.getArtist }
   *  )
   */
  addTextLabel(param, controller) {
    debug('add textlabel %o', param);
    if (!controller || typeof controller !== 'function') {
      throw new Error('INVALID_LABEL_CONTROLLER');
    }
    //NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter: controller } });
    return this;
  }

};

module.exports = deviceBuilder;
