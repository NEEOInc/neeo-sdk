import { ButtonHandler } from './buttonHandler';
import {
  ButtonDescriptor,
  Descriptor,
  DeviceSubscriptionHandler,
  Directory,
  Discovery,
  FavoritesHandler,
  Image,
  PlayerWidget,
  Registration,
  Sensor,
  Slider,
  Subscription,
  Switch,
  TextLabel,
} from './descriptors';
import { DeviceAdapterModel } from './deviceAdapter';
import { DeviceCapability } from './deviceCapability';
import { DeviceSetup } from './deviceSetup';
import { DeviceType } from './deviceType';
import { InitialiseFunction } from './initialiseFunction';
import { TimingSpecifier } from './timingSpecifier';

/* tslint:disable:max-line-length */

/**
 * @module DeviceBuilder
 * @description Factory method to build a custom device.
 * All the controller functions must return a value or a promise object.
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

// avoid doxdox thinking the @module above is for this function.
/** */
export interface DeviceBuilder {
  readonly manufacturer: string;
  readonly deviceidentifier: string;
  readonly directories: Array<{
    param: Directory.Descriptor;
    controller: Directory.Controller;
  }>;
  readonly buttons: ReadonlyArray<{ param: ButtonDescriptor }>;
  readonly discovery: ReadonlyArray<{ controller: Discovery.Controller }>;
  readonly switches: ReadonlyArray<{
    param: Descriptor;
    controller: Switch.Controller;
  }>;
  readonly sliders: ReadonlyArray<{
    param: Slider.Descriptor;
    controller: Slider.Controller;
  }>;
  readonly textLabels: ReadonlyArray<{
    param: TextLabel.Descriptor;
    controller: { getter: TextLabel.Controller };
  }>;
  readonly sensors: ReadonlyArray<{
    param: Sensor.Descriptor;
    controller: Sensor.Controller;
  }>;
  readonly imageUrls: ReadonlyArray<{
    param: Image.Descriptor;
    controller: { getter: Image.Controller };
  }>;
  readonly hasPowerStateSensor: boolean;
  readonly additionalSearchTokens: ReadonlyArray<string>;
  readonly deviceCapabilities: ReadonlyArray<DeviceCapability>;
  readonly devicename: string;
  readonly type: DeviceType;
  readonly setup: DeviceSetup;
  readonly buttonHandler?: ButtonHandler;
  readonly deviceSubscriptionHandlers?: DeviceSubscriptionHandler.Controller;
  readonly favoritesHandler?: FavoritesHandler.Controller;
  readonly registration: any[];
  readonly driverVersion?: number;

  /**
   * @function setManufacturer
   * @param {string} manufacturerName used to find and add the device in the NEEO app.
   * @description Optional parameter to set the device manufacturer. Default manufacturer is NEEO
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setManufacturer('NEEO')
   */
  setManufacturer(manufacturer?: string): this;

  /**
   * @function setDriverVersion
   * @param {Number} version Integer identifying current driver version, used by NEEO Brain to detect a newer version of your device.
   * @description Setting the version allows you to tell the Brain about changes to your devices components. If you for example add new buttons to a device,
   * you can increase the version and this will let the Brain know to fetch the new components (NOTE: the Brain will only add new components,
   * updating or removing old components is not supported). You do not need to update the version if you do not change the components.
   * When adding the version to a device that was previously not versioned, start with 1. The NEEO Brain will assume it was previously 0 and update.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setDriverVersion(1)
   */
  setDriverVersion(version: number): this;

  /**
   * @function setType
   * @param {string} type supported device classes:
   *
   * * ACCESSORY
   * * AUDIO
   * * AVRECEIVER
   * * DVB (aka. satellite receiver)
   * * DVD (aka. disc player)
   * * GAMECONSOLE
   * * HDMISWITCH
   * * LIGHT
   * * MEDIAPLAYER
   * * MUSICPLAYER
   * * PROJECTOR
   * * TUNER
   * * TV
   * * VOD (aka. Video-On-Demand box like Apple TV, Fire TV...)
   * * SOUNDBAR
   * @description Optional parameter to define the device type. Default type is ACCESSORY. It is used to determine the display style and wiring suggestions in the NEEO app. Please note, ACCESSORY devices do not generate a view but can be used in other views as shortcut.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setType('light')
   */
  setType(type: DeviceType): this;

  /**
   * @function setIcon
   * @param {string} icon string identifying the icon, the following icons are currently available: 'sonos', 'neeo-brain'
   * @description Optional parameter to define the device icon. The default icon is defined according to the device type if no custom icon is set.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setIcon('sonos')
   */
  setIcon(icon: 'sonos'): this;

  /**
   * @function setSpecificName
   * @param {string} specificname Optional name to use when adding the device to a room (a name based on the type will be used by default, for example: 'Accessory'). Note this does not apply to devices using discovery.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example .setSpecificName('Specific Device Name')
   */
  setSpecificName(value: string): this;

  /**
   * @function addAdditionalSearchToken
   * @param {string} token additional search keyword
   * @description Optional parameter define additional search tokens the user can enter in the NEEO App "Add Device" section.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * neeoapi.buildDevice('My Device Name')
   *        .addAdditionalSearchToken('MDN')
   */
  addAdditionalSearchToken(token: string): this;

  build(adapterName: string): DeviceAdapterModel;

  /**
   * @function enableDiscovery
   * @param {Object} configuration A configuration object
   * @param {String} configuration.headerText this text will be displayed before the user starts the discovery process
   * @param {String} configuration.description this text will be displayed before the user starts the discovery process
   * @param {Boolean} configuration.enableDynamicDeviceBuilder if set to **true**, the discovery itself will return a devices itself (as .device attribute). This is handy if you have a Hub device which returns different devices with different capabilities. No additional capabilities on the device must be enabled. If set to **false** the driver returns one static device definition. (optional, default: false)
   * @param {Function} discoverFunction Callback function which will return the discovered devices as Array. This Array contains JSON Objects with this content:
   *
   * * **id** unique device identifier, for example mac address
   * * **name** display name which is visible in the frontend
   * * **reachable** true: device is reachable, false: device is not reachable (optional)
   * * **device** if enableDynamicDeviceBuilder is set to true, return the dynamic disovered and build device using the ".buildDevice" function
   *
   * NOTE: if you set enableDynamicDeviceBuilder to true - then the NEEO Brain will query your discovery function with a specific device Id the first time this device is requested. You can either
   *
   * * ignore this option completly and return the discovered devices (might not be the ideal solution as potentially unused devices are build)
   * * or build only the requested device and return that device
   * * You can also use the .registerDeviceSubscriptionHandler function and prebuild the needed devices
   *
   * @description Register a discovery function for your devicedriver. This function can be only defined once per device definition.
   *
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .enableDiscovery(
   *   {
   *     headerText: 'HELLO HEADER',
   *     description: 'ADD SOME ADDITIONAL INFORMATION HOW TO PREPARE YOUR DEVICE',
   *     enableDynamicDeviceBuilder: false,
   *   },
   *   function(optionalDeviceId) {
   *    return [
   *      {
   *        id: 'unique-device-id-001',
   *        name: 'first device',
   *      },
   *      {
   *        id: 'unique-device-id-002',
   *        name: 'second device, but not reachable',
   *        reachable: false,
   *      }
   *    ];
   *   }
   * )
   */
  enableDiscovery(
    configuration: {
      headerText: string;
      description: string;
      enableDynamicDeviceBuilder: boolean;
    },
    controller: Discovery.Controller
  ): this;

  /**
   * @function supportsTiming
   * @description This function allows you to check if the current device type supports timing related information.
   * @return {Boolean} Whether timing is supported or not
   * @example
   *    if (device.supportsTiming()) { }
   */
  supportsTiming(): boolean;

  /**
   * @function supportsFavorites
   * @description This function allows you to check if the current device type supports favorites.
   * @return {Boolean} Whether favorites are supported or not for this device type.
   * @example
   *    if (device.supportsFavorites()) { }
   */
  supportsFavorites(): boolean;

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
  defineTiming(deviceTiming: TimingSpecifier): this;

  /**
   * @function registerSubscriptionFunction
   * @param {Function} controller Called with the notification and optional power state callback functions:
   *
   * - The first argument is the component update callback `updateCallback(options)`
   * - The Second argument contains optional power state callbacks:
   *   if the device supports power state (see **addPowerStateSensor**) 2 additional callbacks are present:
   *   - **powerOnNotificationFunction**, usage: `powerOnNotificationFunction(deviceId)`
   *   - **powerOffNotificationFunction**, usage: `powerOffNotificationFunction(deviceId)`
   * @description Registering this allows sending updated component values to the NEEO Brain
   * (for example switches or sliders state changes).
   * This function can be only defined once per device definition.
   *
   * When the SDK is registered with a Brain the callback will be triggered with an update function as argument
   * (aka. inject the function) and power state update functions.
   * The update function can be used to then send updates to the Brain when the value device components changes
   * (for example a physical slider is moved on the device, the digital slider is updated to the same value).
   * The power updates can be used to notifiy the Brain when a device turns on or off
   * (for example a light is turned off with a physical button).
   *
   * NOTE: if you use ES6 classes, make sure to wrap your callback in an arrow function,
   * for example: `.registerSubscriptionFunction((...args) => controller.setNotificationCallbacks(...args))`
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * let sendComponentUpdate, markDeviceOn, markDeviceOff;
   * deviceBuilder.registerSubscriptionFunction((updateCallback, optionalCallbacks) => {
   *   sendComponentUpdate = updateCallback;
   *   if (optionalCallbacks && optionalCallbacks.powerOnNotificationFunction) {
   *     markDeviceOn = optionalCallbacks.powerOnNotificationFunction;
   *   }
   *   if (optionalCallbacks && optionalCallbacks.powerOffNotificationFunction) {
   *     markDeviceOff = optionalCallbacks.powerOffNotificationFunction;
   *   }
   * });
   *
   * // Update sensor at some later point
   * if (sendComponentUpdate) {
   *   sendComponentUpdate({
   *     uniqueDeviceId: 'default',  // If enableDiscovery is used, use matching deviceId.
   *     component: 'VOLUME_SENSOR', // Name of the component added on start
   *                                 // with the device builder (see `addSlider()` for example)
   *     value: 50,                  // Value to update component to
   *                                 // Should match component type (boolean for switch, ...)
   *   }).catch((error) => {
   *     // sendComponentUpdate returns a Promise
   *     // adding a catch is needed to prevent an unhandled rejection.
   *     console.error('NOTIFICATION_FAILED', error.message);
   *   });
   * }
   * // Update device powerState
   * if (markDeviceOn) {
   *   markDeviceOn('default'); // again if enableDiscovery is used, use matching deviceId
   * }
   */
  registerSubscriptionFunction(controller: Subscription.Controller): this;

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
  registerInitialiseFunction(controller: InitialiseFunction): this;

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
  addButton(button: ButtonDescriptor): this;

  /**
   * @function addButtonGroup
   * @param {String} name A button name group, see validation/buttongroup.js for valid options
   * @description Add multiple buttons defined by the button group name. The UI elements on the NEEO Brain are build automatically depending on the existing buttons of a device. You can add multiple ButtonGroups to a device and you can combine ButtonGroups with addButton calls. You need to be call the addButtonHandler function.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButtonGroup('Numpad')
   * .addButtonHandler((name, deviceId) => {
   *   // handle button events here
   * })
   */
  addButtonGroup(groupName: string): this;

  /**
   * @function addButtonHandler
   * @param {function} controller Callback function which will be called one of the registered button triggered from the Brain.
   * @description Handles the events for all the registered buttons. This function can be only defined once per device definition and MUST be defined if you have added at least one button.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addButtonHandler((name, deviceId) => {
   *    if (name === 'power-on') {
   *      // Power on
   *    } else {
   *      // Power off
   *    }
   * });
   */
  addButtonHandler(handler: ButtonHandler): this;

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
   *   {
   *     setter: (deviceId, newValue) => sliderValue = newValue,
   *     getter: (deviceId) => sliderValue,
   *   }
   * )
   */
  addSlider(param: Slider.Descriptor, controller: Slider.Controller): this;

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
   *   { getter: (deviceId) => sensorValue ) }
   * )
   */
  addSensor(param: Sensor.Descriptor, controller: Sensor.Controller): this;

  /**
   * @function addPowerStateSensor
   * @description Adds a special sensor that can be used to update device power state.
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter return current value of the power sensor
   * @param {Function} controller.setter update current value of the power sensor
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addPowerStateSensor({
   *   setter: (deviceId, newValue) => sensorState = newValue,
   *   getter: (deviceId) => sensorState ),
   *  })
   */
  addPowerStateSensor(controller: Sensor.PowerStateController): this;

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
   *   {
   *     setter: (deviceId, newValue) => switchState = newValue,
   *     getter: (deviceId) => switchState,
   *   }
   *  )
   */
  addSwitch(param: Descriptor, controller: Switch.Controller): this;

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
   *   (deviceId) => 'Rude Tins'
   *  )
   */
  addTextLabel(param: TextLabel.Descriptor, controller: TextLabel.Controller): this;

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
   * - Large images: 480x480px
   * - Small: 100x100px
   *
   * If you want to optimize for a specific target:
   * - img url large: 454x454px
   * - img url small: 100x100px
   * - player: 480x480px
   * - Mini player: 80x80px
   * - list tile images: 215 x 215
   *
   * These guidelines are specifically for the remote, a larger (maybe double) resolution might offer a good compromise for mobile devices.
   * @return {Object} DeviceBuilder
   * @example
   * .addImageUrl(
   *   { name: 'albumcover', label: 'Cover for current album', size: 'small' },
   *   (deviceId) => 'http://imageurl'
   * )
   */
  addImageUrl(param: Image.Descriptor, controller: Image.Controller): this;

  /**
   * @function addDirectory
   * @description Define additional device directories which can be browsed on the device
   * @param {Object} configuration JSON Configuration Object.
   * @param {String} configuration.name identifier of this element.
   * @param {String} configuration.label optional, visible label in the mobile app or on the NEEO Remote.
   * @param {String} configuration.role optional, specific role of the directory (supported roles are 'ROOT' or 'QUEUE')
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.getter should return a list built by listBuilder so the App/NEEO Remote can display the browse result as a list. If the getter callback encounters an error, you can build a list with a 'ListInfoItem' to inform the user about the error
   * @param {Function} controller.action will be called when an item is clicked
   * @return {Object} DeviceBuilder
   * @example
   * .addDirectory({
   *   name: 'DEVICE_PLAY_QUEUE_DIRECTORY',
   *   label: 'Queue',
   *   role: 'QUEUE'
   * }, {
   *   getter: (deviceId, params) => controller.browse(deviceId, params),
   *   action: (deviceId, params) => controller.listAction(deviceId, params),
   * })
   */
  addDirectory(
    configuration: Directory.Descriptor,
    controller: Directory.Controller
  ): this;

  /**
   * @function addQueueDirectory
   * @description **deprecated**: this funciton is for backwards compatibility, use `addDirectory()` instead.
   * @deprecated use `addDirectory()` with the `'QUEUE'` role.
   * @param {Object} configuration JSON Configuration Object, see `addDirectory()` for details.
   * @param {Object} controller Controller callbacks Object, see `addDirectory()` for details.
   * @return {Object} DeviceBuilder
   */
  addQueueDirectory(
    configuration: Directory.Descriptor,
    controller: Directory.Controller
  ): this;

  /**
   * @function addRootDirectory
   * @description **deprecated**: this funciton is for backwards compatibility, use `addDirectory()` instead.
   * @deprecated use `addDirectory()` with the `'ROOT'` role.
   * @param {Object} configuration JSON Configuration Object, see `addDirectory()` for details.
   * @param {Object} controller Controller callbacks Object, see `addDirectory()` for details.
   * @return {Object} DeviceBuilder
   */
  addRootDirectory(
    configuration: Directory.Descriptor,
    controller: Directory.Controller
  ): this;

  /**
   * @function addCapability
   * @description Define additional device capabilities, currently supported capabilities (case sensitive):
   *
   * - "alwaysOn" – the device does not need to be powered on to be useable. You don't need to specify 'POWER ON' and 'POWER OFF' buttons and the device is not identified as "Not so smart device"
   * - "bridgeDevice" – This capability is used after you add a new device, then you have the option to select "Add more from this bridge". For example Philips Hue - the discovered device (Gateway) supports multiple devices (Lamps).
   * - "dynamicDevice" - if dynamicDeviceBuilderEnabled is enabled, the dynamically defined devices should set this capability
   * - "addAnotherDevice" - This capability is used after you add a new device that uses discovery. It gives the option to select "Add another ${device name}"
   * @param {String} capability
   * @return {object} DeviceBuilder
   * @example
   * .addCapability('alwaysOn')
   */
  addCapability(
    capability: 'alwaysOn' | 'bridgeDevice' | 'dynamicDevice' | 'addAnotherDevice'
  ): this;

  /**
   * @function addPlayerWidget
   * @description This is a helper to implement a player widget, it's similar to the button groups
   * because it defines multiple sub components (buttons, sensors, sliders, ...). The player can
   * only be added for the MUSICPLAYER / MEDIAPLAYER / VOD device types.
   *
   * PLEASE NOTE: this is a BETA feature, development is still in progress
   *
   * The following components will be registered:
   * - Buttons: PLAY, PLAY TOGGLE, PAUSE, VOLUME UP, VOLUME DOWN, MUTE TOGGLE, NEXT TRACK, PREVIOUS TRACK, SHUFFLE TOGGLE, REPEAT TOGGLE, CLEAR QUEUE
   * - Directories: root, (optional) queue
   * - Slider: VOLUME
   * - Sensors: COVER_ART_SENSOR, TITLE_SENSOR, DESCRIPTION_SENSOR
   * - Switches: PLAYING, MUTE, SHUFFLE, REPEAT
   *
   * Note: it is also possible to add all the required components manually
   * without using addPlayerWidget(), it can be more flexible for advanced use
   * but it is more error prone.
   * @param {PlayerWidget.Controller} controller Controller and player settings definition.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .addPlayerWidget({
   *   rootDirectory: {
   *     name: 'PLAYER_ROOT_DIRECTORY', // Optional: will default to ROOT_DIRECTORY
   *     label: 'My Library', // Optional: will default to ROOT
   *     controller: { getter: (deviceId, params) => ..., action: (deviceId, params) => ...},
   *   },
   *   // Optional:
   *   queueDirectory: {
   *     name: 'PLAYER_QUEUE_DIRECTORY', // Optional: will default to QUEUE_DIRECTORY
   *     label: 'Queue', // Optional: will default to QUEUE
   *     controller: { getter: (deviceId, params) => ..., action: (deviceId, params) => ...},
   *   },
   *   volumeController: { getter: (deviceId) => ..., setter: (deviceId, params) => ...},
   *   coverArtController: { getter: (deviceId) => ... },
   *   titleController: { getter: (deviceId) => ... },
   *   descriptionController: { getter: (deviceId) => ... },
   *   playingController: { getter: (deviceId) => ..., setter: (deviceId, params) => ...},
   *   muteController: { getter: (deviceId) => ..., setter: (deviceId, params) => ...},
   *   shuffleController: { getter: (deviceId) => ..., setter: (deviceId, params) => ...},
   *   repeatController: { getter: (deviceId) => ..., setter: (deviceId, params) => ...},
   * })
   * .addButtonHandler(((deviceid, name) => {
   *   // The button handler is needed, but still registered separately.
   * }));
   */
  addPlayerWidget(handler: PlayerWidget.Controller): this;

  /**
   * @function enableRegistration
   * @param {object} options An object which contains
   * @param {String} options.type Defines the type of registration. The currently supported registration types are:
   *
   * * SECURITY_CODE
   * * ACCOUNT
   * @param {String} options.headerText This header will be displayed when the user starts the register process
   * @param {String} options.description Text displayed during registration, should guide the user through how to find and enter the credentials needed.
   * @param {Object} controller Controller callbacks Object
   * @param {Function} controller.register Callback function which will be called when the user starts the registration. The callback has one parameter, **credentials** which either contains:
   *
   * * **securityCode** for the registration type of SECURITY_CODE
   * * **username**, **password** for the registration type of ACCOUNT
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
  enableRegistration(options: Registration.Options, controller: Registration.Controller): this;

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
  registerDeviceSubscriptionHandler(controller: DeviceSubscriptionHandler.Controller): this;

  /**
   * @function registerFavoriteHandlers
   * @param {FavoritesHandler.Controller} controller Controller callbacks Object
   * @param {Function} controller.execute This callback is executed when a favorite channel is triggered on the Brain
   * The callback has two parameters:
   * **deviceId**: string identifying the device.
   * **favoriteId**: string identifying the favorite channel to execute
   * @description This allows a device that supports favorites (only TV, DVB or TUNER)
   * to implement a custom handler, for example for channel "42", rather than
   * 2 buttonHandler calls for "4" and "2", a single call with "42" will be
   * made to the favoriteHandler.
   * @return {DeviceBuilder} DeviceBuilder for chaining.
   * @example
   * .registerFavoriteHandlers(
   *   {
   *     execute: (deviceId, favoriteId) => debug('favorite executed', deviceId, favoriteId),
   *   }
   * )
   */
  registerFavoriteHandlers(controller: FavoritesHandler.Controller): this;
}
