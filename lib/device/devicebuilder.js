'use strict';

const DeviceCapability = require('./devicecapability');
const validation = require('./validation');
const debug = require('debug')('neeo:device:DeviceBuilder');

const MAXIMAL_STRING_LENGTH = 48;
const DEFAULT_MANUFACTURER = 'NEEO';
const DEFAULT_TYPE = 'ACCESSOIRE';
const API_VERSION = '1.0';
const MAXIMAL_TIMING_VALUE_MS = 60 * 1000;
/**
 * @module DeviceBuilder
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
 *    .addTextLabel({ name: 'example-textlabel', label: 'my label', isLabelVisible: false },
 *      { controller.getValue });
 *
 *
 */

/** */ // avoid doxdox thinking the @module above is for this function.
const deviceBuilder = class DeviceBuilder {
  constructor(name, uniqueString) {
    if (!validation.stringLength(name, MAXIMAL_STRING_LENGTH)) {
      throw new Error('DEVICENNAME_TOO_LONG');
    }
    this.devicename = name;
    this.deviceidentifier = 'apt-' + validation.getUniqueName(this.devicename, uniqueString);
    this.manufacturer = DEFAULT_MANUFACTURER;
    this.type = DEFAULT_TYPE;
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
    this.directories = [];
    this.discovery = [];
    this.registration = [];
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
    if (!validation.stringLength(manufacturer, MAXIMAL_STRING_LENGTH)) {
      throw new Error('MANUFACTURER_NAME_TOO_LONG');
    }
    this.manufacturer = manufacturer;
    return this;
  }

  /**
   * @function setType
   * @param {string} type supported device classes, either 'ACCESSORY', 'AVRECEIVER', 'DVB' (aka. satellite receiver), 'DVD' (aka. disc player), 'GAMECONSOLE', 'LIGHT', 'MEDIAPLAYER', 'MUSICPLAYER', 'PROJECTOR', 'TV' or 'VOD' (aka. Video-On-Demand box like Apple TV, Fire TV...)
   * @description Optional parameter to define the device type. Default type is ACCESSOIRE. It is used to determine the display style and wiring suggestions in the NEEO app. Please note, ACCESSOIRE devices do not generate a view but can be used in other views as shortcut.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setType('light')
   */
  setType(type) {
    this.type = validation.getDeviceType(type);
    return this;
  }

  /**
   * @function setIcon
   * @param {string} icon string identifying the icon, the following icons are currently available: 'sonos'
   * @description Optional parameter to define the device icon. The default icon is defined according to the device type if no custom icon is set.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setIcon('sonos')
   */
  setIcon(iconName) {
    this.icon = validation.getDeviceIcon(iconName);
    return this;
  }

  /**
   * @function setSpecificName
   * @param {string} specificName Optional name to use when adding the device to a room (a name based on the type will be used by default, for example: 'Accessory'). Note this does not apply to devices using discovery.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setSpecificName('Specific Device Name')
   */
  setSpecificName(specificName) {
    if (!validation.stringLength(specificName, MAXIMAL_STRING_LENGTH)) {
      throw new Error('SPECIFIC_NAME_TOO_LONG');
    }
    this.specificname = specificName;
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
    if (this.setup.registration && !this.setup.discovery) {
      throw new Error('REGISTRATION_ENABLED_MISSING_DISCOVERY_STEP');
    }

    this.buttons = this.buttons.map((button) => {
      const boundFunction = this.buttonhandler.bind(null, button.param.name);
      return { param: button.param, controller: boundFunction };
    });

    if (this.setup.registration) {
      this.deviceCapabilities.push('register-user-account');
    }

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

    const adapterDefinition = {
      adapterName: this.deviceidentifier,
      apiversion: API_VERSION,
      type: this.type,
      manufacturer: this.manufacturer,
      setup: this.setup,
      devices: [{
        name: this.devicename,
        tokens: this.additionalSearchTokens,
      }],
      capabilities,
      handler,
      deviceCapabilities: this.deviceCapabilities,
      subscriptionFunction: this.subscriptionFunction,
    };

    if (this.specificname) {
      adapterDefinition.devices[0].specificname = this.specificname;
    }

    if (this.icon) {
      adapterDefinition.devices[0].icon = this.icon;
    }

    if (this.initialiseFunction) {
      adapterDefinition.initialiseFunction = this.initialiseFunction;
    }

    if (this.timing) {
      adapterDefinition.timing = this.timing;
    }

    return adapterDefinition;
  }

  /**
   * @function enableDiscovery
   * @param {Object} messages An object which contains (optional) **headerText** and **description**, this text will be displayed before the user starts the discovery process
   * @param {Function} controller Callback function which will be called when the NEEO Brain search your device.
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
  enableDiscovery(options, controller) {
    debug('enable discovery %o', options);
    if (typeof controller !== 'function') {
      throw new Error('INVALID_DISCOVERY_FUNCTION');
    }
    if (!options || !options.headerText || !options.description) {
      throw new Error('INVALID_DISCOVERY_PARAMETER');
    }
    if (this.setup.discovery) {
      throw new Error('DISCOVERHANLDER_ALREADY_DEFINED');
    }

    this.setup = Object.assign(this.setup, {
        discovery: true,
        introheader: options.headerText,
        introtext: options.description,
      });

    this.discovery.push({ controller });
    return this;
  }

  /**
   * @function enableRegistration
   * @param {object} options An object which contains
   * @param {String} options.type Defines the type of registration, currently only SECURITY_CODE pairing registrations are supported.
   * @param {String} options.headerText This header will be displayed when the user starts the register process
   * @param {String} options.description Text displayed during registration, should guide the user through how to find and enter the credentials needed.
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.register Callback function which will be called when the user starts the registration, eg. the user entries will be passed to your code. The callback has one parameter:
   * **credentials**: will be populated with user provided value, eg. the security code.
   * @param {Function} controller.isRegistered Callback function that must resolve true if valid credentials already exists, so the user does not need to register again. Note: if you always return false, the user can provide credentials each time a new device is added.
   * @description Enable a registration or pairing step before discovery your device, for example if the device you want support needs to a pairing code to work.
   * This function can be only defined once per device definition.
   * enableRegistration can only be used when enableDiscovery is also used - for the user registration takes place before discovery
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .enableRegistration(
   *   {
   *     type: 'SECURITY_CODE',
   *     headerText: 'DEVICE REGISTRATION',
   *     description: 'Please enter the pairing code of your device',
   *   },
   *   {
   *     register: (credentials) => myCredentials = credentials,
   *     isRegistered: () => booleanIfValidCredentialsAlreadyExists,
   *   }
   * )
   */
  enableRegistration(options, controller) {
    debug('enable registration %o', options);
    if (this.setup.registration) {
      throw new Error('REGISTERHANLDER_ALREADY_DEFINED');
    }
    if (!controller || typeof controller.register !== 'function' || typeof controller.isRegistered !== 'function') {
      throw new Error('INVALID_REGISTRATION_CONTROLLER');
    }
    if (!options) {
      throw new Error('INVALID_REGISTRATION: Options cannot be undefined');
    }
    if (options.type !== 'SECURITY_CODE') {
      throw new Error('INVALID_REGISTRATION_TYPE: ' + options.type);
    }
    if (!options.headerText || !options.description) {
      throw new Error('MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION');
    }

    this.setup = Object.assign(this.setup, {
        registration: true,
        registrationType: options.type,
        registrationHeader: options.headerText,
        registrationText: options.description,
      });

    this.registration.push({ controller });
    return this;
  }

  /**
   * @function supportsTiming
   * @description This function allows you to check if the current device type supports timing related information.
   * @return {Boolean} Whether timing is supported or not
   * @example
   *    if (device.supportsTiming()) { }
   */
  supportsTiming() {
    return !validation.deviceTypeDoesNotSupportTiming(this.type);
  }

  /**
   * @function defineTiming
   * @description This function allows you to define timing related information, which will be used to generate the recipe.
   * @param {Object} configuration JSON Configuration Object
   * @param {Number} configuration.powerOnDelayMs how long does it take (in ms) until the device is powered on and is ready to accept new commands
   * @param {Number} configuration.sourceSwitchDelayMs how long does it take (in ms) until the device switched input and is ready to accept new commands
   * @param {Number} configuration.shutdownDelayMs how long does it take (in ms) until the device is powered off and is ready to accept new commands
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
   * @param {Function} controller Callback function which will be called when the NEEO SDK Server starts, to register the update notification callback function and optional callback functions.
   * OptionalCallbacks: if the device supports power state (see **addPowerStateSensor**) this additional callbacks are present: **powerOnNotificationFunction** - call this function with its deviceid when the device powers on.
   * **powerOffNotificationFunction** - call this function with its deviceid when the device powers on
   * @description This is used for devices which need to send dynamic value updates (for example switches or sliders state) to the Brain they are registered on.
   * When the device is added to a Brain the SDK will call the controller function with an update function as argument (aka. inject the function). This function can be used to then send updates to the Brain when the value of the device updates.
   * For example a device with a physical slider can use this to keep the digital slider in sync. This function can be only defined once per device definition.
   * NOTE: if you use ES6 classes, make sure to wrap your callback in an arrow function, for example: .registerSubscriptionFunction((...args) => controller.setNotificationCallbacks(...args))
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
   * @param {Function} controller Callback function which will be called when the device should be initialised.
   * @description for example: start polling for devicestate, initialise service
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   *
   * .registerInitialiseFunction(controller.initialise)
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

  /**
   * @function registerDeviceSubscriptionHandler
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.deviceAdded Callback function used when a device from this SDK is added on the Brain. Can be used to start listening to updates for that device.
   * The callback has one parameter:
   * **deviceId**: string identifying the device.
   * @param {Function} controller.deviceRemoved Callback function used when a device from this SDK is removed from the Brain. Can be used to stop listening to updates for that device.
   * The callback has one parameter:
   * **deviceId**: string identifying the device.
   * @param {Function} controller.initializeDeviceList Callback function used on startup once the SDK can reach the Brain,
   * this is called on startup with the current subscriptions removing the need to save them in the SDK.
   * The callback has one parameter:
   * **deviceIds**: Array of deviceId string for all devices of this SDK currently on the Brain.
   * @description This allows tracking which devices are currently used on the Brain,
   * it can be used to avoid sending Brain notifications for devices not added on the Brain,
   * to remove registration credentials when the last device is removed,
   * or to free up resources if no devices are used by the Brain.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .registerDeviceSubscriptionHandler(
   *   {
   *     deviceAdded: (deviceId) => debug('device added', deviceId),
   *     deviceRemoved: (deviceId) => debug('device removed', deviceId),
   *     initializeDeviceList: (deviceIds) => debug('existing devices', deviceIds),
   *   }
   * )
   */
  registerDeviceSubscriptionHandler(controller) {
    debug('enable device subscriptions');
    if (this.deviceSubscriptionHandlers) {
      throw new Error('DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED');
    }
    if (!controller) {
      throw new Error('INVALID_SUBSCRIPTION_CONTROLLER_UNDEFINED');
    }
    const requiredFuncions = [
      'deviceAdded',
      'deviceRemoved',
      'initializeDeviceList',
    ];
    const missingFunctions = requiredFuncions.filter((functionName) => {
      return typeof controller[functionName] !== 'function';
    });
    if (missingFunctions.length !== 0) {
      throw new Error(`INVALID_SUBSCRIPTION_CONTROLLER missing ${missingFunctions.join(', ')} function(s)`);
    }

    this.deviceSubscriptionHandlers = controller;

    return this;
  }

  checkParamName(param) {
    if (!param || !param.name) {
      throw new Error('MISSING_ELEMENT_NAME');
    }
    if (!validation.stringLength(param.name, MAXIMAL_STRING_LENGTH)) {
      throw new Error('NAME_TOO_LONG_' + param.name);
    }
  }

  checkOptionalLabel(param) {
    if (!param || !param.label) {
      return;
    }
    if (!validation.stringLength(param.label, MAXIMAL_STRING_LENGTH)) {
      throw new Error('LABEL_TOO_LONG_' + param.label);
    }
  }

  /**
   * @function addButton
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.name identifier of this element
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote
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
    this.checkOptionalLabel(param);
    this.buttons.push({ param });
    return this;
  }

  /**
   * @function addButtonGroup
   * @param {String} name A button name group, see validation/buttongroup.js for valid options
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
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.name identifier of this element
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote
   * @param {Array} configuration.range optional, custom range of slider, default 0..100
   * @param {String} configuration.unit optional, user readable label, default %
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter return the current slider value
   * @param {Function} controller.action update the current slider value
   * @description Add a (range) slider to your custom device
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addSlider(
   *   { name: 'example-slider', label: 'my slider', range: [0,200], unit: '%' },
   *   { setter: (newValue) => sensorValue = newValue, getter: () => sensorValue ) }
   * )
   */
  addSlider(param, controller) {
    debug('add slider %o', param);
    this.checkParamName(param);
    this.checkOptionalLabel(param);
    if (!controller || typeof controller.setter !== 'function' || typeof controller.getter !== 'function') {
      throw new Error(`INVALID_SLIDER_CONTROLLER: ${param.name}`);
    }
    this.sliders.push({ param, controller });
    return this;
  }

  /**
   * @function addSensor
   * @description Add a range/binary sensor to your custom device
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.name Identifier of this element
   * @param {String} configuration.label Optional, visible label in the mobile app or on the NEEO Remote
   * @param {String} configuration.type Type of sensor, the available types are binary, range, power (should be done using addPowerStateSensor), string, array
   * @param {Array} configuration.range Optional, custom range of sensor, default 0..100
   * @param {String} configuration.unit Optional, user readable label, default %
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter A Function that returns the current sensor value
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addSensor(
   *   { name: 'example-sensor', label: 'my sensor', type: 'range', range: [0,200], unit: '%' },
   *   { getter: () => sensorValue ) }
   * )
   */
  addSensor(param, controller) {
    debug('add sensor %o', param);
    this.checkParamName(param);
    this.checkOptionalLabel(param);
    if (!controller || typeof controller.getter !== 'function') {
      throw new Error(`INVALID_SENSOR_CONTROLLER: ${param.name}`);
    }
    this.sensors.push({ param, controller });
    return this;
  }

  /**
   * @function addPowerStateSensor
   * @description Add a power sensor to your custom device, so the NEEO Brain knows when this device is powered on or off. See **registerSubscriptionFunction** how the controller can send powerOn and powerOff notifications to the Brain.
   * @param {Object} controller An object which contains a getter callback function, the function must return true or false as value or wrapped in a promise
   * @param {Function} controller.getter
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addPowerStateSensor(
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
      type: 'power',
    };
    this.sensors.push({ param, controller });
    this.hasPowerStateSensor = true;
    return this;
  }

  /**
   * @function addSwitch
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.name identifier of this element
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter return current value of the Switch
   * @param {Function} controller.setter update current value of the Switch
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
    this.checkOptionalLabel(param);
    if (!controller || typeof controller.setter !== 'function' || typeof controller.getter !== 'function') {
      throw new Error(`INVALID_SWITCH_CONTROLLER: ${param.name}`);
    }
    this.switches.push({ param, controller });
    return this;
  }

  /**
   * @function addTextLabel
   * @param {Object} configuration JSON Configuration Object
   * @param {String} configuration.name identifier of this element
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote
   * @param {Boolean} configuration.isLabelVisible should the label be visible
   * @param {Function} controller A function which returns the content of the text label.
   * @description Add a text label to your custom element (for example to display the current artist)
   * @return {Object} DeviceBuilder
   * @example
   * .addTextLabel(
   *   { name: 'artistname', label: 'Artist name', isLabelVisible: false },
   *   controller.getArtist
   *  )
   */
  addTextLabel(param, controller) {
    debug('add textlabel %o', param);
    this.checkParamName(param);
    this.checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_LABEL_CONTROLLER: ${param.name}`);
    }
    //NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter: controller } });
    return this;
  }

  /**
   * @function addImageUrl
   * @param {Object} configuration JSON Configuration Object.
   * @param {String} configuration.name identifier of this element.
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote.
   * @param {String} configuration.uri HTTP URI pointing to an image resource. JPG and PNG images are supported.
   * @param {String} configuration.size image size in the ui, either 'small' or 'large'. The small image has the size of a button while the large image is a square image using full width of the client.
   * @param {Function} controller A function which returns the address (URL) to the current image.
   * @description Add an image to your custom element (for example to display the album cover of the current track).
   * To avoid downloading and resizing large images on the Brain use these general guidelines:
   * - Large images: 480 x 480
   * - Small: 100 x 100
   * If you want to optimize for a specific target:
   * - img url large: 454 x 454
   * - img url small: 100 x 100
   * - player: 480 x 480
   * - list images (and mini player): 80 x 80
   * - list tile images: 215 x 215
   * **Note**: These are specifically for the remote, if you're also concerned about the mobile app images a little larger (maybe double) might offer a good compromise for mobile devices.
   * @return {Object} DeviceBuilder
   * @example
   * .addImageUrl(
   *   { name: 'albumcover', label: 'Cover for current album', size: 'small' },
   *   controller.getImageUri
   * )
   */
  addImageUrl(param, controller) {
    debug('add imageurl %o', param);
    this.checkParamName(param);
    this.checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_IMAGEURL_CONTROLLER: ${param.name}`);
    }
    this.imageUrls.push({ param, controller: { getter: controller } });
    return this;
  }

  /**
   * @function addDirectory
   * @description Define additional device directories which can be browsed on the device
   * @param {Object} configuration JSON Configuration Object.
   * @param {String} configuration.name identifier of this element.
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote.
   * @param {Boolean} configuration.isQueue optional, name of the directory to be used for the queue - mediaplayer only
   * @param {Boolean} configuration.isRoot optional, name of the directory that will be the 'root' level of your list
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter should return a list built by listBuilder so the App/NEEO Remote can display the browse result as a list. If the getter callback encounters an error, you can build a list with a 'ListInfoItem' to inform the user about the error
   * @param {Function} controller.action will be called when an item is clicked
   * @return {Object} DeviceBuilder
   * @deprecated use addQueueDirectory or addRootDirectory
   * @example
   * .addDirectory({
   *   name: 'DEVICE_PLAY_QUEUE_DIRECTORY',
   *   label: 'Queue',
   *   isQueue: true,
   * }, controller.handleDirectory)
   */
  addDirectory(param, controller) {
    debug('add directory %o', param);
    this.checkParamName(param);
    if (!param.label) {
      throw new Error('MISSING_DIRECTORY_LABEL');
    }
    if (!validation.stringLength(param.label, MAXIMAL_STRING_LENGTH)) {
      throw new Error('DIRECTORY_LABEL_TOO_LONG_' + param.label);
    }

    if (!controller) {
      throw new Error(`INVALID_DIRECTORY_CONTROLLER: ${param.name}`);
    }
    if (typeof controller.getter !== 'function') {
      throw new Error(`INVALID_DIRECTORY_CONTROLLER_GETTER_NOT_A_FUNCTION: ${param.name}`);
    }

    if (typeof controller.action !== 'function') {
      throw new Error(`INVALID_DIRECTORY_CONTROLLER_ACTION_NOT_A_FUNCTION: ${param.name}`);
    }

    this.directories.push({ param, controller });
    return this;
  }

  /**
   * @function addQueueDirectory
   * @description Define queue directory which can be browsed on the device
   * @param {Object} configuration JSON Configuration Object.
   * @param {String} configuration.name identifier of this element.
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote.
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter should return a list built by listBuilder so the App/NEEO Remote can display the browse result as a list.
   * If the getter callback encounters an error, you can build a list with a 'ListInfoItem' to inform the user about the error.
   * the getter function is called with (deviceId, params) parameter. params contains information about the current list and contains those fields:
   * - params.browseIdentifier: the browseIdentifier you defined for an entry, empty to fetch the root directory
   * - params.limit: maximal page size
   * - params.offset: offset position is list to show the next page of lists
   * @param {Function} controller.action will be called when an item is clicked
   * @return {Object} DeviceBuilder
   * @example
   * .addQueueDirectory({
   *   name: 'DEVICE_PLAY_QUEUE_DIRECTORY',
   *   label: 'Queue',
   * }, controller.handleDirectory)
   */
  addQueueDirectory(param, controller) {
    debug('add queue directory %o', param);
    this.checkParamName(param);
    param.isQueue = true;
    this.addDirectory(param, controller);
    return this;
  }

  /**
   * @function addRootDirectory
   * @description Define root directory which can be browsed on the device
   * @param {Object} configuration JSON Configuration Object.
   * @param {String} configuration.name identifier of this element.
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote.
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter should return a list built by listBuilder so the App/NEEO Remote can display the browse result as a list.
   * If the getter callback encounters an error, you can build a list with a 'ListInfoItem' to inform the user about the error
   * the getter function is called with (deviceId, params) parameter. params contains information about the current list and contains those fields:
   * - params.browseIdentifier: the browseIdentifier you defined for an entry, empty to fetch the root directory
   * - params.limit: maximal page size
   * - params.offset: offset position is list to show the next page of lists
   * @param {Function} controller.action will be called when an item is clicked
   * @return {Object} DeviceBuilder
   * @example
   * .addRootDirectory({
   *   name: 'DEVICE_PLAY_ROOT_DIRECTORY',
   *   label: 'Root View',
   * }, controller.handleDirectory)
   */
  addRootDirectory(param, controller) {
    debug('add root directory %o', param);
    this.checkParamName(param);
    param.isRoot = true;
    this.addDirectory(param, controller);
    return this;
  }

  /**
   * @function addCapability
   * @description Define additional device capabilities, currently supported capabilities (case sensitive):
   * - "alwaysOn" – the device does not need to be powered on to be useable. You don't need to specify 'POWER ON' and 'POWER OFF' buttons and the device is not identified as "Not so smart device"
   * - "bridgeDevice" – This capability is used after you add a new device, then you have the option to select "Add more from this bridge". For example Philips Hue - the discovered device (Gateway) supports multiple devices (Lamps).
   * - "addAnotherDevice" - This capability is used after you add a new device that uses discovery. It gives the option to select "Add another ${device name}"
   * @param {String} capability
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
