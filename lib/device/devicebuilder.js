'use strict';

const DeviceCapability = require('./devicecapability');
const validation = require('./validation');
const debug = require('debug')('neeo:device:DeviceBuilder');

const DEFAULT_MANUFACTURER = 'NEEO';
const DEFAULT_TYPE = 'ACCESSOIRE';
const API_VERSION = '1.0';
const MAXIMAL_TIMING_VALUE_MS = 60 * 1000;
/**
 * @module Devicebuilder
 * @description Factory method to build a custom device. All the controller functions must return a value or a promise object.
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
 *
 */

/** */ // avoid doxdox thinking the @module above is for this function.
const deviceBuilder = class DeviceBuilder {
  constructor(name, uniqueString) {
    this.deviceidentifier = 'apt-' + validation.getUniqueName(name, uniqueString);
    this.manufacturer = DEFAULT_MANUFACTURER;
    this.type = DEFAULT_TYPE;
    this.devicename = name;
    this.additionalSearchTokens = [];
    this.buttonhandler = undefined;
    this.initialiseFunction = undefined;
    this.deviceCapabilities = [];
    this.sensors = [];
    this.buttons = [];
    this.sliders = [];
    this.textLabels = [];
    this.imageUrls = [];
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
   * @param {string} type supported device classes, either 'ACCESSORY', 'AVRECEIVER', 'DVB' (aka. satellite receiver), 'DVD' (aka. disc player), 'GAMECONSOLE', 'LIGHT', 'MEDIAPLAYER', 'PROJECTOR', 'TV' or 'VOD' (aka. Video-On-Demand box like Apple TV, Fire TV...)
   * @description Optional parameter to define the device type. Default type is ACCESSOIRE. It is used to determine the display style and wiring suggestions in the NEEO app. Please note, ACCESSOIRE devices do not generate a view but can be used in other views as shortcut.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setType('light')
   */
  setType(type) {
    this.type = validation.getDeviceType(type);
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
    if (this.timing && validation.deviceTypeDoesNotSupportTiming(this.type)) {
      throw new Error('TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT');
    }

    this.buttons = this.buttons.map((button) => {
      const boundFunction = this.buttonhandler.bind(null, button.param.name);
      return { param: button.param, controller: boundFunction };
    });

    const deviceCapability = DeviceCapability.build(this, adapterName);
    const capabilities = deviceCapability.capabilities;
    const handler = deviceCapability.handlers;

    if (capabilities.length === 0) {
      throw new Error('INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES');
    }

    if (validation.deviceTypeNeedsInputCommand(this.type) && validation.hasNoInputButtonsDefined(this.buttons)) {
      console.warn('\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!');
      console.warn('WARNING: no input commands defined! Your device might not work as desired, check the docs');
      console.warn('Devicename:', this.devicename);
    }

    const device = {
      adapterName: this.deviceidentifier,
      apiversion: API_VERSION,
      type: this.type,
      manufacturer: this.manufacturer,
      setup: this.setup,
      devices: [{
        name: this.devicename,
        tokens: this.additionalSearchTokens
      }],
      capabilities,
      handler,
      deviceCapabilities: this.deviceCapabilities,
      subscriptionFunction: this.subscriptionFunction,
    };

    if (this.initialiseFunction) {
      device.initialiseFunction = this.initialiseFunction;
    }
    if (this.timing) {
      device.timing = this.timing;
    }
    return device;
  }

  /**
   * @function enableDiscovery
   * @param {object} messages An object which contains (optional)
   * **headerText** and **description**, this text will be displayed before the user starts the discovery process
   * @param {function} controller Callback function which will be called when the NEEO brain search your device.
   * This function should return an array of found devices, each object with an **id** attribute (unique device identifier, for example mac address), **name** the display name and the optional **reachable** attribute (true: device is reachable, false: device is not reachable)
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
   * @function supportsTiming
   * @description This function allows you to check if the current device type supports timing related information.
   * @return {boolean} Whether timing is supported or not
   * @example
   *    if (device.supportsTiming()) { }
   */
  supportsTiming() {
    return !validation.deviceTypeDoesNotSupportTiming(this.type);
  }

  /**
   * @function defineTiming
   * @description This function allows you to define timing related information, which will be used to generate the recipe.
   * @param {object} param An object which contains at least one of the following attributes:
   *
   * - **powerOnDelayMs**, how long does it take (in ms) until the device is powered on and is ready to accept new commands
   * - **sourceSwitchDelayMs**,: how long does it take (in ms) until the device switched input and is ready to accept new commands
   * - **shutdownDelayMs**: how long does it take (in ms) until the device is powered off and is ready to accept new commands
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   *    .defineTiming({ powerOnDelayMs: 2000, sourceSwitchDelayMs: 500, shutdownDelayMs: 1000 })
   */
  defineTiming(param) {
    function validateTime(timeMs) {
      if (!Number.isInteger(timeMs)) {
        throw new Error('INVALID_TIMING_VALUE');
      }
      if (timeMs < 0 || timeMs > MAXIMAL_TIMING_VALUE_MS) {
        throw new Error('INVALID_TIMING_VALUE');
      }
      return timeMs;
    }

    debug('define timing %o', param);
    if (!param || !(param.powerOnDelayMs || param.sourceSwitchDelayMs || param.shutdownDelayMs)) {
      throw new Error('INVALID_TIMING_PARAMETER');
    }

    this.timing = {};
    if (param.powerOnDelayMs) {
      this.timing.standbyCommandDelay = validateTime(param.powerOnDelayMs);
    }
    if (param.sourceSwitchDelayMs) {
      this.timing.sourceSwitchDelay = validateTime(param.sourceSwitchDelayMs);
    }
    if (param.shutdownDelayMs) {
      this.timing.shutdownDelay = validateTime(param.shutdownDelayMs);
    }
    return this;
  }

  /**
   * @function registerSubscriptionFunction
   * @param {function} controller Callback function which will be called when the NEEO SDK Server starts, to register the update notification callback function and optional callback functions.
   * OptionalCallbacks: if the device supports power state (see **addPowerStateSensor**) this additional callbacks are present: **powerOnNotificationFunction** - call this function with its deviceid when the device powers on.
   * **powerOffNotificationFunction** - call this function with its deviceid when the device powers on
   * @description This is used for devices which need to send dynamic value updates (for example switches or sliders state) to the Brain they are registered on.
   * When the device is added to a Brain the SDK will call the controller function with an update function as argument (aka. inject the function). This function can be used to then send updates to the Brain when the value of the device updates.
   * For example a device with a physical slider can use this to keep the digital slider in sync. This function can be only defined once per device definition.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * let updateCallbackReference, markDeviceOn, markDeviceOff;
   * deviceBuilder.registerSubscriptionFunction((updateCallback, optionalCallbackFunctions) => {
   *   updateCallbackReference = updateCallback;
   *   if (optionalCallbackFunctions && optionalCallbackFunctions.powerOnNotificationFunction) {
   *     markDeviceOn = optionalCallbackFunctions.powerOnNotificationFunction;
   *   }
   *   if (optionalCallbackFunctions && optionalCallbackFunctions.powerOffNotificationFunction) {
   *     markDeviceOff = optionalCallbackFunctions.powerOffNotificationFunction;
   *   }
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
      throw new Error('INVALID_SUBSCRIPTIONHANDLER_FUNCTION');
    }
    if (this.subscriptionFunction) {
      throw new Error('SUBSCRIPTIONHANDLER_ALREADY_DEFINED');
    }
    this.subscriptionFunction = controller;
    return this;
  }

  /**
   * @function registerInitialiseFunction
   * @param {function} controller Callback function which will be called when the device should be initialised. Controller must return a value or a promise object.
   * @description for example: start polling for devicestate, initialise service
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   *
   * .registerInitialiseFunction(controller.initialise)
   *
   *
   * // Example code in the controller:
   * module.exports.initialise = function() {
   *   debug('initialise LIFX service, start polling');
   *   lifxService = new LifxService(deviceState);
   *   setInterval(pollAllLifxDevices, DEVICE_POLL_TIME_MS);
   * };
   */
  registerInitialiseFunction(controller) {
    debug('get initialise function');
    if (typeof controller !== 'function') {
      throw new Error('INVALID_INITIALISATION_FUNCTION');
    }
    if (this.initialiseFunction) {
      throw new Error('INITIALISATION_FUNCTION_ALREADY_DEFINED');
    }
    this.initialiseFunction = controller;
    return this;
  }

  checkParamName(param) {
    if (!param || !param.name) {
      throw new Error('MISSING_ELEMENT_NAME');
    }
  }
  /**
   * @function addButton
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote)
   * @description Add a button for this device, can be called multiple times for multiple buttons. addButton can be combined with addButtonGroups.
   * You need to be call the addButtonHandler function. **IMPORTANT:** If your device supports a discrete "Power On" and "Power Off" command,
   * name the macros like in the example below. In that case the NEEO Brain automatically recognise this feature and those commands to in the prebuild
   * Recipes.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButton({ name: 'POWER ON', label: 'Power On' })
   * .addButton({ name: 'POWER OFF', label: 'Power Off' })
   * .addButtonHandler((deviceid, name) => {
   *   // handle button events here
   * })
   */
  addButton(param) {
    debug('add button %o', param);
    this.checkParamName(param);
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
   * .addButtonHandler((name, deviceid) => {
   *   // handle button events here
   * })
   */
  addButtonGroup(name) {
    debug('add buttongroup with name', name);
    const buttonGroup = validation.getButtonGroup(name);
    if (Array.isArray(buttonGroup)) {
      buttonGroup.forEach((button) => {
        this.addButton({ name: button });
      });
    }
    return this;
  }

  /**
   * @function addButtonHandler
   * @param {function} controller Callback function which will be called one of the registered button triggered from the Brain.
   * @description Handles the events for all the registered buttons. This function can be only defined once per device definition and MUST be defined if you have added at least one button.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButtonHandler((name, deviceid) => {
   *    if (name === 'power-on') {
   *      // Power on
   *    } else {
   *      // Power off
   *    }
   * });
   */
  addButtonHandler(controller) {
    debug('add buttonhandler');
    if (typeof controller !== 'function') {
      throw new Error('MISSING_BUTTONHANDLER_CONTROLLER_PARAMETER');
    }
    if (this.buttonhandler) {
      throw new Error('BUTTONHANDLER_ALREADY_DEFINED');
    }
    this.buttonhandler = controller;
    return this;
  }

  // dont break the SDK, @deprecated
  addButtonHander(controller) {
    return this.addButtonHandler(controller);
  }

  /**
   * @function addSlider
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote), **range** (optional, custom range of slider, default 0..100), **unit** (optional user readable label, default %)
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
    this.checkParamName(param);
    if (!controller || typeof controller.setter !== 'function' || typeof controller.getter !== 'function') {
      throw new Error('INVALID_SLIDER_CONTROLLER');
    }
    this.sliders.push({ param, controller });
    return this;
  }

  /**
   * @function addSensor
   * @description Add a (range) sensor to your custom device
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, visible label in the mobile app or on the NEEO Remote), **range** (optional, custom range of slider, default 0..100), **unit** (optional user readable label, default %)
   * @param {object} controller An object which contains a getter callback function.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .addSensor(
   *   { name: 'example-sensor', label: 'my sensor', range: [0,200], unit: '%' },
   *   { getter: () => sensorValue ) }
   * )
   */
  addSensor(param, controller) {
    debug('add sensor %o', param);
    this.checkParamName(param);
    if (!controller || typeof controller.getter !== 'function') {
      throw new Error('INVALID_SENSOR_CONTROLLER');
    }
    this.sensors.push({ param, controller });
    return this;
  }

  /**
   * @function addPowerStateSensor
   * @description Add a power sensor to your custom device, so the NEEO Brain knows when this device is powered on or off. See **registerSubscriptionFunction** how the controller can send powerOn and powerOff notifications to the Brain.
   * @param {object} controller An object which contains a getter callback function, the function must return true or false as value or wrapped in a promise
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .addPowerStateSensor(
   *   { getter: () => sensorValue ) }
   * )
   */
  addPowerStateSensor(controller) {
    debug('add power sensor');
    if (!controller || typeof controller.getter !== 'function') {
      throw new Error('INVALID_POWERSENSOR_CONTROLLER');
    }
    const param = {
      name: 'powerstate',
      label: 'Powerstate',
      type: 'power'
    };
    this.sensors.push({ param, controller });
    this.hasPowerStateSensor = true;
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
    this.checkParamName(param);
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
   *   controller.getArtist
   *  )
   */
  addTextLabel(param, controller) {
    debug('add textlabel %o', param);
    this.checkParamName(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error('INVALID_LABEL_CONTROLLER');
    }
    //NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter: controller } });
    return this;
  }

  /**
   * @function addImageUrl
   * @param {object} param An object which contains **name** (identifier of this element), **label** (optional, alternative image text), **uri** (address pointing to an image resource), **size** (image size in the ui, either 'small' or 'large'). The small image has the size of a button while the large image is a square image using full width of the client. JPG and PNG images are supported.
   * @param {object} controller An object which returns the address to the current image.
   * @description Add an image to your custom element (for example to display the album cover of the current track)
   * @return {object} DeviceBuilder
   * @example
   * .addImageUrl(
   *   { name: 'albumcover', label: 'Cover for current album', size: 'small' },
   *   controller.getImageUri
   * )
   */
  addImageUrl(param, controller) {
    debug('add imageurl %o', param);
    this.checkParamName(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error('INVALID_IMAGEURL_CONTROLLER');
    }
    this.imageUrls.push({ param, controller: { getter: controller } });
    return this;
  }

  /**
   * @function addCapability
   * @description Define additional device capabilities, currently supported capabilities (case sensitive):
   * - "alwaysOn" - the device does not need to be powered on to be useable. You don't need to specify 'POWER ON' and 'POWER OFF' buttons and the device is not identified as "Stupid device"
   * @param {string} capability
   * @return {object} DeviceBuilder
   * @example
   * .addCapability('alwaysOn')
   */
  addCapability(_capability) {
    debug('add capability %o', _capability);
    const capability = validation.validateCapability(_capability);
    this.deviceCapabilities.push(capability);
    return this;
  }
};

module.exports = deviceBuilder;
