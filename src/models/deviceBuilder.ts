import { DeviceTypes } from './deviceTypes';
import { DeviceAdapterModel } from './deviceAdapter';
import { DiscoveryResult } from './discoveryResult';
import { TimingSpecifier } from './timingSpecifier';
import { ButtonHandler } from './buttonHandler';
import { ButtonDescriptor } from './descriptors/buttonDescriptor';
import { SensorDescriptor } from './descriptors/sensorDescriptor';
import { SliderDescriptor } from './descriptors/sliderDescriptor';
import { SwitchDescriptor } from './descriptors/switchDescriptor';
import { DirectoryDescriptor } from './descriptors/directoryDescriptor';
import { TextLabelDescriptor } from './descriptors/textLabelDescriptor';
import { ImageDescriptor } from './descriptors/imageDescriptor';
import { InitialiseFunction } from './initialiseFunction';
import { SubscriptionFunction } from './subscriptionFunction';
import { DeviceSubscriptionHandler } from './deviceSubscriptionHandler';
import { DeviceSetup } from './deviceSetup';
import { Registration } from './registration';

/**
 * Factory for building a custom device.
 * All controller functions can return a value in place or a promise to a value.
 * @example
 *  neeoapi.buildDevice('simpleDevice1')
 *    .setManufacturer('NEEO')
 *    .addAdditionalSearchToken('foo')
 *    .setType('light')
 *    .addButton({ name: 'example-button', label: 'my button' })
 *    .addSwitch({ name: 'example-switch', label: 'my switch' },
 *      { setter: controller.switchSet, getter: controller.switchGet })
 *    .addSlider({ name: 'example-slider', label: 'my slider', range: [0,110], unit: '%' },
 *      { setter: controller.sliderSet, getter: controller.sliderGet });
 *
 */
export interface DeviceBuilder {
  readonly manufacturer: string;
  readonly deviceIdentifier: string;
  readonly buttons: ReadonlyArray<{ param: ButtonDescriptor }>;
  readonly discovery: ReadonlyArray<{ controller: DiscoveryResult.Controller }>;
  readonly switches: ReadonlyArray<{
    param: SwitchDescriptor;
    controller: SwitchDescriptor.Controller;
  }>;
  readonly sliders: ReadonlyArray<{
    param: SliderDescriptor;
    controller: SliderDescriptor.Controller;
  }>;
  readonly textLabels: ReadonlyArray<{
    param: TextLabelDescriptor;
    controller: { getter: TextLabelDescriptor.Controller };
  }>;
  readonly sensors: ReadonlyArray<{
    param: SensorDescriptor;
    controller: SensorDescriptor.Controller;
  }>;
  readonly imageUrls: ReadonlyArray<{
    param: ImageDescriptor;
    controller: { getter: ImageDescriptor.Controller };
  }>;
  readonly hasPowerStateSensor: boolean;
  readonly additionalSearchTokens: ReadonlyArray<string>;
  readonly deviceCapabilities: ReadonlyArray<string>;
  readonly deviceName: string;
  readonly type: DeviceTypes;
  readonly setup: DeviceSetup;
  readonly buttonHandler?: ButtonHandler;
  readonly deviceSubscriptionHandlers?: DeviceSubscriptionHandler.Controller;

  /**
   * Set the name of the manufacturer of the device.
   * @param manufacturer Optional name of manufacturer (defaulting to NEEO).
   * @returns This device builder (for chaining calls).
   * @example
   * .setManufacturer('Samsung')
   */
  setManufacturer(manufacturer?: string): this;

  /**
   * Set the device type to ACCESSOIRE.
   * @returns This device builder (for chaining calls).
   * @example
   * .setType()
   */
  setType(): this;
  /**
   * Set the device type to one of the available options.
   * (ACCESSOIRE, AVRECEIVER, DVB, DVD, GAMECONSOLE, LIGHT, MEDIAPLAYER, PROJECTOR, TV, or VOD).
   * @param type The device type (one of: ACCESSOIRE, AVRECEIVER, DVB, DVD, GAMECONSOLE, LIGHT, MEDIAPLAYER, PROJECTOR, TV, or VOD).
   * @returns This device builder (for chaining calls).
   * @example
   * .setType('AVRECEIVER')
   */
  setType(type: DeviceTypes): this;
  /**
   * Set the device type to one of the available options case insensitively.
   * (ACCESSOIRE or its alias of ACCESSORY, AVRECEIVER, DVB, DVD, GAMECONSOLE, LIGHT, MEDIAPLAYER, PROJECTOR, TV, or VOD).
   * @param type The device type (case-insensitive one of: ACCESSORY, ACCESSOIRE, AVRECEIVER, DVB, DVD, GAMECONSOLE, LIGHT, MEDIAPLAYER, PROJECTOR, TV, or VOD).
   * @returns This device builder (for chaining calls).
   * @example
   * .setType('AVRECEIVER')
   */
  setType(type: string): this;

  /**
   * Associate an icon with the device.
   * Currently the only supported icon is 'sonos' - expect this list to expand in the future.
   * @param icon The name of the icon - currently the only supported icon is 'sonos' - expect this list to expand in the future.
   * @returns This device builder (for chaining calls).
   * @example
   * .setIcon('sonos')
   */
  setIcon(icon: 'sonos'): this;

  /**
   * Optionally, associate a specific name to use when adding the device to a room.
   * Note that this does not apply to devices found by discovery.
   * @param value Specific device name.
   * @returns This device builder (for chaining calls).
   * @example
   * .setSpecificName('TV Model ABC')
   */
  setSpecificName(value: string): this;
  /**
   * Clear any specific name associated with this device.  Instead NEEO will choose a name based on the type (such as 'Accessory').
   * Note that this does not apply to devices found by discovery.
   * @returns This device builder (for chaining calls).
   * @example
   * .setSpecificName()
   */
  setSpecificName(): this;

  /**
   * Add a search token keyword to be used to find devices in the NEEO app "Add Device" section.
   * @param token Search token.
   * @returns This device builder (for chaining calls).
   * @example
   * .addAdditionalSearchToken('abc')
   */
  addAdditionalSearchToken(token: string): this;

  build(adapterName: string): DeviceAdapterModel;

  /**
   * Enable the NEEO brain to discover device(s) on the network.
   * @param param An object which contains a **description** that will be displayed before the user starts the discovery process.
   * @param controller Callback function which will be called when the NEEO brain is searching for your device.  This should return
   * a array of discovered devices or a promise to an array of discovered devices.  Each discovered device should have an id (a unique
   * device id), a name, and optionally a value indicating whether or not the device is reachable.
   * @returns This device builder (for chaining calls).
   * @example
   * .enableDiscovery(
   *  {
   *    description: 'DESCRIPTION TEXT'
   *  },
   *  () => [
   *    { id: 'unique-id-1', name: 'First Device' },
   *    { id: 'unique-id-2', name: 'Second Device (not reachable)', reachable: false },
   *  ]
   * )
   */
  enableDiscovery(
    param: { description: string },
    controller: DiscoveryResult.Controller
  ): this;
  /**
   * Enable the NEEO brain to discover device(s) on the network.
   * @param param An object which contains **headerText** that will be displayed before the user starts the discovery process.
   * @param controller Callback function which will be called when the NEEO brain is searching for your device.  This should return
   * a array of discovered devices or a promise to an array of discovered devices.  Each discovered device should have an id (a unique
   * device id), a name, and optionally a value indicating whether or not the device is reachable.
   * @returns This device builder (for chaining calls).
   * @example
   * .enableDiscovery(
   *  {
   *    headerText: 'HEADER TEXT'
   *  },
   *  () => [
   *    { id: 'unique-id-1', name: 'First Device' },
   *    { id: 'unique-id-2', name: 'Second Device (not reachable)', reachable: false },
   *  ]
   * )
   */
  enableDiscovery(
    param: { headerText: string },
    controller: DiscoveryResult.Controller
  ): this;
  /**
   * Enable the NEEO brain to discover device(s) on the network.
   * @param param An object which contains a **description** and **headerText** that will be displayed before the user starts the discovery process.
   * @param controller Callback function which will be called when the NEEO brain is searching for your device.  This should return
   * a array of discovered devices or a promise to an array of discovered devices.  Each discovered device should have an id (a unique
   * device id), a name, and optionally a value indicating whether or not the device is reachable.
   * @returns This device builder (for chaining calls).
   * @example
   * .enableDiscovery(
   *  {
   *    headerText: 'HEADER TEXT',
   *    description: 'DESCRIPTION TEXT'
   *  },
   *  () => [
   *    { id: 'unique-id-1', name: 'First Device' },
   *    { id: 'unique-id-2', name: 'Second Device (not reachable)', reachable: false },
   *  ]
   * )
   */
  enableDiscovery(
    param: { headerText: string; description: string },
    controller: DiscoveryResult.Controller
  ): this;

  /**
   * Gets a value indicating whether the current device type supports timing related information (delays for power on/off and input change).
   * @returns Boolean value.
   * @example
   * if (device.supportsTiming()) {
   * }
   */
  supportsTiming(): boolean;

  /**
   * Define a set of delays for the device for power on (powerOnDelayMs), power off (shutdownDelayMs),
   * and/or input change (sourceSwitchDelayMs). If this method is called at least one delay must be defined,
   * and no delay can be negative or longer than a minute.
   * @param deviceTiming A delay timing specifier.
   * @returns This device builder (for chaining calls).
   * @example
   * .defineTiming({ powerOnDelayMs: 1000, sourceSwitchDelayMs: 500, shutdownDelayMs: 100 });
   */
  defineTiming(deviceTiming: TimingSpecifier): this;

  /**
   *  This is used for devices which need to send dynamic value updates (for example switches or sliders state) to the Brain they are registered on.
   * When the device is added to a Brain the SDK will call the controller function with an update function as argument (aka. inject the function). This function can be used to then send updates to the Brain when the value of the device updates.
   * For example a device with a physical slider can use this to keep the digital slider in sync. This function can be only defined once per device definition.
   * NOTE: if you use ES6 classes, make sure to wrap your callback in an arrow function, for example: .registerSubscriptionFunction((...args) => controller.setNotificationCallbacks(...args))
   * @param controller Callback function which will be called when the NEEO SDK Server starts, to register the update notification callback function and optional callback functions.
   * OptionalCallbacks: if the device supports power state (see **addPowerStateSensor**) this additional callbacks are present: **powerOnNotificationFunction** - call this function with its deviceid when the device powers on.
   * **powerOffNotificationFunction** - call this function with its deviceid when the device powers on
   * @return DeviceBuilder for chaining.
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
  registerSubscriptionFunction(controller: SubscriptionFunction): this;

  /**
   * Optionally define a function that NEEO should call to initialize the device adapter.
   * This function can run in place, or return a promise for its execution.
   * @param controller
   * @returns This device builder (for chaining calls).
   * @example
   * .registerInitialiseFunction(() => externalApi.initAsPromise());
   */
  registerInitialiseFunction(controller: InitialiseFunction): this;

  /**
   * Add a button for this device, can be called multiple times for multiple buttons. `addButton` can be combined with calls to `addButtonGroup`.
   * **IMPORTANT:** If your device supports a discrete "Power On" and "Power Off" command, name the macros like in the example below.
   * In that case the NEEO Brain automatically recognizes this feature and those commands to in the prebuilt Recipes.
   *
   * You will need to call `addButtonHandler` method.
   * @param  button An object which contains **name** (identifier of this element),
   * **label** (optional, visible label in the mobile app or on the NEEO Remote).
   * @returns This device builder (for chaining calls).
   * @example
   * .addButton({ name: 'POWER ON', label: 'Power On' })
   * .addButton({ name: 'POWER OFF', label: 'Power Off' })
   */
  addButton(button: ButtonDescriptor): this;

  /**
   * Add a set of buttons via a well known group name.
   * For example for Power On/Off, there is a group named `Power`, For 0-9, there is a group called `Numpad`,
   * there are several others defined (see lib/device/validation/buttonGroup.js).
   *
   * You will need to call `addButtonHandler` method.
   * @param groupName
   * @returns This device builder (for chaining calls).
   * @example
   * .addButtonGroup('Power')
   * .addButtonGroup('Numpad')
   */
  addButtonGroup(groupName: string): this;

  /**
   * If at least one button (or button group) is defined, a button handler must be specified.
   *
   * A button handler is a callback that takes the button name and device identifier as parameters,
   * and either processes the button press in place, or returns a promise for handling of the
   * button.
   * @param handler The button handler.
   * @returns This device builder (for chaining calls).
   * @example
   * .addButtonHandler((buttonName, deviceId) => {
   *  switch(buttonName) {
   *    case 'POWER ON':
   *      return sendPowerOnAsPromise(deviceId);
   *    case 'POWER OFF':
   *      return sendPowerOffAsPromise(deviceId);
   *  }
   *  return Promise.reject('Unknown button name: ' + buttonName);
   * })
   */
  addButtonHandler(handler: ButtonHandler): this;

  /**
   *
   * @param param
   * @param controller
   * @returns This device builder (for chaining calls).
   */
  addSlider(
    param: SliderDescriptor,
    controller: SliderDescriptor.Controller
  ): this;

  /**
   *
   * @param param
   * @param controller
   * @returns This device builder (for chaining calls).
   */
  addSensor(
    param: SensorDescriptor,
    controller: SensorDescriptor.Controller
  ): this;

  /**
   *
   * @param param
   * @param controller
   * @returns This device builder (for chaining calls).
   */
  addPowerStateSensor(controller: SensorDescriptor.PowerStateController): this;

  /**
   *
   * @param param
   * @param controller
   * @returns This device builder (for chaining calls).
   */
  addSwitch(
    param: SwitchDescriptor,
    controller: SwitchDescriptor.Controller
  ): this;

  /**
   *
   * @param param
   * @param controller
   * @returns This device builder (for chaining calls).
   */
  addTextLabel(
    param: TextLabelDescriptor,
    controller: TextLabelDescriptor.Controller
  ): this;

  /**
   * Add an image to your custom element (for example to display the album cover of the current track).
   * @param param Configuration json object.
   * @param controller An object which returns the address to the current image.
   * @returns This device builder (for chaining calls).
   * @example
   * .addImageUrl(
   *   { name: 'albumcover', label: 'Cover for current album', size: 'small' },
   *   controller.getImageUri
   * )
   */
  addImageUrl(
    param: ImageDescriptor,
    controller: ImageDescriptor.Controller
  ): this;

  /**
   * Define additional device directories which can be browsed on the device.
   * @param configuration JSON Configuration Object.
   * @param controller Controller callbacks Object
   * @return DeviceBuilder for chaining.
   * @deprecated Use `addQueueDirectory` or `addRootDirectory`.
   * @example
   * .addRootDirectory({
   *   name: 'DEVICE_PLAY_ROOT_DIRECTORY',
   *   label: 'Root View',
   * }, controller.handleDirectory)
   */
  addDirectory(
    configuration: DirectoryDescriptor,
    controller: DirectoryDescriptor.Controller
  ): this;

  /**
   * Define queue directories which can be browsed on the device.
   * @param configuration JSON Configuration Object.
   * @param controller Controller callbacks Object
   * @return DeviceBuilder for chaining.
   * @example
   * .addRootDirectory({
   *   name: 'DEVICE_PLAY_ROOT_DIRECTORY',
   *   label: 'Root View',
   * }, controller.handleDirectory)
   */
  addQueueDirectory(
    param: DirectoryDescriptor,
    controller: DirectoryDescriptor.Controller
  ): this;

  /**
   * Define root directory which can be browsed on the device.
   * @param configuration JSON Configuration Object.
   * @param controller Controller callbacks Object
   * @return DeviceBuilder for chaining.
   * @example
   * .addRootDirectory({
   *   name: 'DEVICE_PLAY_ROOT_DIRECTORY',
   *   label: 'Root View',
   * }, controller.handleDirectory)
   */
  addRootDirectory(
    param: DirectoryDescriptor,
    controller: DirectoryDescriptor.Controller
  ): this;

  /**
   * Define additional device capabilities, currently supported capabilities (case sensitive):
   * - "alwaysOn" - the device does not need to be powered on to be useable. You don't need to specify 'POWER ON' and 'POWER OFF' buttons and the device is not identified as "Not so smart device",
   * - "bridgeDevice" - A bridge device is for example Philips Hue - the discovered device (Gateway) supports multiple devices (Lamps). This capability is used after you add a new device, then you have the option to select "Add more from this bridge"
   * @param capability name (currently only 'alwaysOn' and 'bridgeDevice' are supported).
   * @returns This device builder (for chaining calls).
   * @example
   * .addCapability('alwaysOn')
   */
  addCapability(capability: 'alwaysOn' | 'bridgeDevice'): this;

  /**
   * Enable a registration or pairing step before discovery your device, for example if the device you want support needs to a pairing code to work.
   * This function can be only defined once per device definition.
   * enableRegistration can only be used when enableDiscovery is also used - for the user registration takes place before discovery.
   * **NOTE**: This function is experimental and should not be used in production.
   * It is subject to change, currently account login is not supported the data is transfer is not yet encrypted!
   *
   * @param {String} options.type defines the type of registration, currently only SECURITY_CODE pairing registrations are supported.
   * @param {String} options.headerText this header will be displayed when the user starts the register process
   * @param {String} options.description Text displayed during registration, should guide the user through how to find and enter the credentials needed.
   * @param {Object} controller Controller callbacks Object
   * @param {function} controller.register Callback function which will be called when the user starts the registration, eg. the user entries will be passed to your code. The callback has one parameter:
   * **credentials**: will be populated with user provided value, eg. the security code.
   * @param {function} controller.isRegistered callback that must resolve true if valid credentials already exists, so the user does not need to register again. Note: if you always return false, the user can provide credentials each time a new device is added.
   * @returns This device builder (for chaining calls).
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
  enableRegistration(
    options: Registration.Options,
    controller: Registration.Controller
  ): this;

  /**
   * This allows tracking which devices are currently used on the Brain,
   * it can be used to avoid sending Brain notifications for devices not added on the Brain,
   * to remove registration credentials when the last device is removed,
   * or to free up resources if no devices are used by the Brain.
   * @param controller Controller callbacks Object.
   * @return DeviceBuilder for chaining.
   * @example
   * .registerDeviceSubscriptionHandler(
   *   {
   *     deviceAdded: (deviceId) => debug('device added', deviceId),
   *     deviceRemoved: (deviceId) => debug('device removed', deviceId),
   *     initializeDeviceList: (deviceIds) => debug('existing devices', deviceIds),
   *   }
   * )
   */
  registerDeviceSubscriptionHandler(
    controller: DeviceSubscriptionHandler.Controller
  ): this;
}
