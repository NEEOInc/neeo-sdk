import * as Debug from 'debug';
import * as validation from './validation';
import * as Models from '../models';
import buildDeviceCapabilities from './deviceCapability';

const debug = Debug('neeo:device:DeviceBuilder');

const MAXIMAL_STRING_LENGTH = 48;
const DEFAULT_MANUFACTURER = 'NEEO';
const DEFAULT_TYPE: Models.DeviceTypes = 'ACCESSOIRE';
const API_VERSION = '1.0';
const MAXIMAL_TIMING_VALUE_MS = 60 * 1000;

function checkParamName(param?: { name?: string }) {
  if (!param || !param.name) {
    throw new Error('MISSING_ELEMENT_NAME');
  }
  if (!validation.stringLength(param.name, MAXIMAL_STRING_LENGTH)) {
    throw new Error('NAME_TOO_LONG_' + param.name);
  }
}

function checkOptionalLabel(param?: { label?: string }) {
  if (!param || !param.label) {
    return;
  }
  if (!validation.stringLength(param.label, MAXIMAL_STRING_LENGTH)) {
    throw new Error('LABEL_TOO_LONG_' + param.label);
  }
}

export default class implements Models.DeviceBuilder {
  readonly buttons: Array<{ param: Models.ButtonDescriptor }>;
  readonly deviceIdentifier: string;
  readonly sensors: Array<{
    param: Models.SensorDescriptor;
    controller: Models.SensorDescriptor.Controller;
  }>;
  readonly discovery: Array<{ controller: Models.DiscoveryResult.Controller }>;
  readonly sliders: Array<{
    param: Models.SliderDescriptor;
    controller: Models.SliderDescriptor.Controller;
  }>;
  readonly switches: Array<{
    param: Models.SwitchDescriptor;
    controller: Models.SwitchDescriptor.Controller;
  }>;
  readonly textLabels: Array<{
    param: Models.TextLabelDescriptor;
    controller: { getter: Models.TextLabelDescriptor.Controller };
  }>;
  readonly imageUrls: Array<{
    param: Models.ImageDescriptor;
    controller: { getter: Models.ImageDescriptor.Controller };
  }>;
  readonly directories: Array<{
    param: Models.DirectoryDescriptor;
    controller: Models.DirectoryDescriptor.Controller;
  }>;
  readonly registration: Array<any>;
  readonly additionalSearchTokens: string[];
  readonly deviceCapabilities: string[];
  readonly deviceName: string;
  buttonHandler?: Models.ButtonHandler;
  hasPowerStateSensor: boolean;
  manufacturer: string = DEFAULT_MANUFACTURER;
  type = DEFAULT_TYPE;
  setup: Models.DeviceSetup;
  deviceSubscriptionHandlers?: Models.DeviceSubscriptionHandler.Controller;

  private icon?: string;
  private initializeFunction?: Models.InitialiseFunction;
  private subscriptionFunction?: Models.SubscriptionFunction;
  private specificName?: string;
  private timing?: Models.DeviceTiming;

  constructor(name: string, uniqueString?: string) {
    if (!validation.stringLength(name, MAXIMAL_STRING_LENGTH)) {
      throw new Error('DEVICENNAME_TOO_LONG');
    }
    this.deviceIdentifier = `apt-${validation.getUniqueName(
      name,
      uniqueString
    )}`;
    this.deviceName = name;
    this.setup = {};
    this.hasPowerStateSensor = false;
    this.sensors = [];
    this.deviceCapabilities = [];
    this.buttons = [];
    this.additionalSearchTokens = [];
    this.discovery = [];
    this.sliders = [];
    this.switches = [];
    this.textLabels = [];
    this.imageUrls = [];
    this.directories = [];
    this.registration = [];
  }

  setManufacturer(manufacturer = DEFAULT_MANUFACTURER) {
    if (!validation.stringLength(manufacturer, MAXIMAL_STRING_LENGTH)) {
      throw new Error('MANUFACTURER_NAME_TOO_LONG');
    }
    this.manufacturer = manufacturer;
    return this;
  }

  setType(type: string = DEFAULT_TYPE) {
    this.type = validation.getDeviceType(type);
    return this;
  }

  setIcon(iconName = 'sonos') {
    this.icon = validation.getIcon(iconName);
    return this;
  }

  setSpecificName(specificName?: string) {
    if (
      specificName &&
      !validation.stringLength(specificName, MAXIMAL_STRING_LENGTH)
    ) {
      throw new Error('SPECIFIC_NAME_TOO_LONG');
    }
    this.specificName = specificName;
    return this;
  }

  addAdditionalSearchToken(token: string) {
    this.additionalSearchTokens.push(token);
    return this;
  }

  build(adapterName: string): Models.DeviceAdapterModel {
    if (!adapterName) {
      throw new Error('MISSING_ADAPTERNAME');
    }
    const {
      buttons,
      buttonHandler,
      deviceName,
      type,
      deviceIdentifier,
      manufacturer,
      setup,
      additionalSearchTokens,
      deviceCapabilities,
      specificName: specificname,
      icon,
      timing,
      subscriptionFunction,
      initializeFunction: initialiseFunction
    } = this;
    if (timing && validation.deviceTypeDoesNotSupportTiming(type)) {
      throw new Error('TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT');
    }
    if (buttons.length && !buttonHandler) {
      throw new Error('BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED');
    }
    if (setup.registration && !setup.discovery) {
      throw new Error('REGISTRATION_ENABLED_MISSING_DISCOVERY_STEP');
    }
    const { capabilities, handlers: handler } = buildDeviceCapabilities(
      this,
      adapterName
    );
    if (!capabilities.length) {
      throw new Error('INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES');
    }
    if (setup.registration) {
      deviceCapabilities.push('register-user-account');
    }
    if (
      validation.deviceTypeNeedsInputCommand(type) &&
      validation.hasNoInputButtonsDefined(buttons)
    ) {
      console.warn(
        '\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!'
      );
      console.warn(
        'WARNING: no input commands defined! Your device might not work as desired, check the docs'
      );
      console.warn('Devicename:', deviceName);
    }
    return {
      adapterName: deviceIdentifier,
      apiversion: API_VERSION,
      type,
      manufacturer,
      setup,
      devices: [
        {
          name: deviceName,
          tokens: additionalSearchTokens,
          specificname,
          icon
        }
      ],
      capabilities,
      handler,
      deviceCapabilities,
      timing,
      subscriptionFunction,
      initialiseFunction
    };
  }

  enableDiscovery(
    options: { headerText?: string; description?: string },
    controller: Models.DiscoveryResult.Controller
  ) {
    debug('enable discovery %o', options);
    if (typeof controller !== 'function') {
      throw new Error('INVALID_DISCOVERY_FUNCTION');
    }
    if (!options) {
      throw new Error('INVALID_DISCOVERY_PARAMETER');
    }
    const { headerText, description } = options;
    if (!headerText || !description) {
      throw new Error('INVALID_DISCOVERY_PARAMETER');
    }
    const { setup, discovery } = this;
    if (setup.discovery) {
      throw new Error('DISCOVERHANDLER_ALREADY_DEFINED');
    }
    this.setup = Object.assign(setup, {
      discovery: true,
      introheader: headerText,
      introtext: description
    });
    discovery.push({ controller });
    return this;
  }

  supportsTiming() {
    return !validation.deviceTypeDoesNotSupportTiming(this.type);
  }

  defineTiming(param: Models.TimingSpecifier) {
    if (!param) {
      throw new Error('INVALID_TIMING_PARAMETER');
    }

    function validateTime(timeMs: number) {
      if (!Number.isInteger(timeMs)) {
        throw new Error('INVALID_TIMING_VALUE');
      }
      if (timeMs < 0 || timeMs > MAXIMAL_TIMING_VALUE_MS) {
        throw new Error('INVALID_TIMING_VALUE');
      }
      return timeMs;
    }

    debug('define timing %o', param);
    const { powerOnDelayMs, sourceSwitchDelayMs, shutdownDelayMs } = param;
    if (!powerOnDelayMs && !sourceSwitchDelayMs && !shutdownDelayMs) {
      throw new Error('INVALID_TIMING_PARAMETER');
    }
    this.timing = {
      standbyCommandDelay: !!powerOnDelayMs
        ? validateTime(powerOnDelayMs)
        : undefined,
      sourceSwitchDelay: !!sourceSwitchDelayMs
        ? validateTime(sourceSwitchDelayMs)
        : undefined,
      shutdownDelay: !!shutdownDelayMs
        ? validateTime(shutdownDelayMs)
        : undefined
    };
    return this;
  }

  registerSubscriptionFunction(controller: Models.SubscriptionFunction) {
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

  registerInitialiseFunction(controller: Models.InitialiseFunction) {
    debug('get initialise function');
    if (typeof controller !== 'function') {
      throw new Error('INVALID_INITIALISATION_FUNCTION');
    }
    if (this.initializeFunction) {
      throw new Error('INITIALISATION_FUNCTION_ALREADY_DEFINED');
    }
    this.initializeFunction = controller;
    return this;
  }

  registerDeviceSubscriptionHandler(
    controller: Models.DeviceSubscriptionHandler.Controller
  ) {
    debug('enable device subscriptions');
    if (this.deviceSubscriptionHandlers) {
      throw new Error('DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED');
    }
    if (!controller) {
      throw new Error('INVALID_SUBSCRIPTION_CONTROLLER_UNDEFINED');
    }
    const requiredFuncions: ReadonlyArray<
      keyof Models.DeviceSubscriptionHandler.Controller
    > = ['deviceAdded', 'deviceRemoved', 'initializeDeviceList'];
    const missingFunctions = requiredFuncions.filter(functionName => {
      return typeof controller[functionName] !== 'function';
    });
    if (missingFunctions.length) {
      throw new Error(
        `INVALID_SUBSCRIPTION_CONTROLLER missing ${missingFunctions.join(
          ', '
        )} function(s)`
      );
    }
    this.deviceSubscriptionHandlers = controller;

    return this;
  }

  addButton(param: Models.ButtonDescriptor) {
    debug('add button %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    this.buttons.push({ param });
    return this;
  }

  addButtonGroup(groupName: string) {
    debug('add buttongroup with name', groupName);
    const buttonGroup = validation.getButtonGroup(groupName);
    if (Array.isArray(buttonGroup)) {
      buttonGroup.forEach(name => this.addButton({ name }));
    }
    return this;
  }

  addButtonHandler(controller: Models.ButtonHandler) {
    debug('add buttonhandler');
    if (typeof controller !== 'function') {
      throw new Error('MISSING_BUTTONHANDLER_CONTROLLER_PARAMETER');
    }
    if (this.buttonHandler) {
      throw new Error('BUTTONHANDLER_ALREADY_DEFINED');
    }
    this.buttonHandler = controller;
    return this;
  }

  enableRegistration(
    options: Models.Registration.Options,
    controller: Models.Registration.Controller
  ) {
    const { setup, registration } = this;
    debug('enable registration %o', options);
    if (setup.registration) {
      throw new Error('REGISTERHANLDER_ALREADY_DEFINED');
    }
    if (
      !controller ||
      typeof controller.register !== 'function' ||
      typeof controller.isRegistered !== 'function'
    ) {
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
    Object.assign(setup, {
      registration: true,
      registrationType: options.type,
      registrationHeader: options.headerText,
      registrationText: options.description
    });
    registration.push({ controller });
    return this;
  }

  addSlider(
    param: Models.SliderDescriptor,
    controller: Models.SliderDescriptor.Controller
  ) {
    debug('add slider %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (
      !controller ||
      typeof controller.setter !== 'function' ||
      typeof controller.getter !== 'function'
    ) {
      throw new Error(`INVALID_SLIDER_CONTROLLER: ${param.name}`);
    }
    this.sliders.push({ param, controller });
    return this;
  }

  addSensor(
    param: Models.SensorDescriptor,
    controller: Models.SensorDescriptor.Controller
  ) {
    debug('add sensor %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller.getter !== 'function') {
      throw new Error(`INVALID_SENSOR_CONTROLLER: ${param.name}`);
    }
    this.sensors.push({ param, controller });
    return this;
  }

  addPowerStateSensor(
    controller: Models.SensorDescriptor.PowerStateController
  ) {
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

  addSwitch(
    param: Models.SwitchDescriptor,
    controller: Models.SwitchDescriptor.Controller
  ) {
    debug('add switch %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (
      !controller ||
      typeof controller.setter !== 'function' ||
      typeof controller.getter !== 'function'
    ) {
      throw new Error(`INVALID_SWITCH_CONTROLLER: ${param.name}`);
    }
    this.switches.push({ param, controller });
    return this;
  }

  addTextLabel(
    param: Models.TextLabelDescriptor,
    controller: Models.TextLabelDescriptor.Controller
  ) {
    debug('add textlabel %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_LABEL_CONTROLLER: ${param.name}`);
    }
    //NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter: controller } });
    return this;
  }

  addImageUrl(
    param: Models.ImageDescriptor,
    controller: Models.ImageDescriptor.Controller
  ) {
    debug('add imageurl %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_IMAGEURL_CONTROLLER: ${param.name}`);
    }
    this.imageUrls.push({ param, controller: { getter: controller } });
    return this;
  }

  addDirectory(
    param: Models.DirectoryDescriptor,
    controller: Models.DirectoryDescriptor.Controller
  ) {
    debug('add directory %o', param);
    checkParamName(param);
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
      throw new Error(
        `INVALID_DIRECTORY_CONTROLLER_GETTER_NOT_A_FUNCTION: ${param.name}`
      );
    }
    if (typeof controller.action !== 'function') {
      throw new Error(
        `INVALID_DIRECTORY_CONTROLLER_ACTION_NOT_A_FUNCTION: ${param.name}`
      );
    }
    this.directories.push({ param, controller });
    return this;
  }

  addQueueDirectory(
    param: Models.DirectoryDescriptor,
    controller: Models.DirectoryDescriptor.Controller
  ) {
    debug('add queue directory %o', param);
    checkParamName(param);
    param.isQueue = true;
    this.addDirectory(param, controller);
    return this;
  }

  addRootDirectory(
    param: Models.DirectoryDescriptor,
    controller: Models.DirectoryDescriptor.Controller
  ) {
    debug('add root directory %o', param);
    checkParamName(param);
    param.isRoot = true;
    this.addDirectory(param, controller);
    return this;
  }

  addCapability(capability: string) {
    debug('add capability %o', capability);
    this.deviceCapabilities.push(validation.validateCapability(capability));
    return this;
  }

  /**
   * Do not break the SDK. This is a deprecated typo.
   * @param controller The button handler controller.
   */
  addButtonHander(controller: Models.ButtonHandler) {
    this.addButtonHandler(controller);
  }
}
