import * as Debug from 'debug';
import * as Models from '../models';
import buildDeviceCapabilities from './deviceCapability';
import * as validation from './validation';

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

export class DeviceBuilder implements Models.DeviceBuilder {
  public readonly buttons: Array<{ param: Models.ButtonDescriptor }>;
  public readonly deviceidentifier: string;
  public readonly sensors: Array<{
    param: Models.SensorDescriptor;
    controller: Models.SensorDescriptor.Controller;
  }>;
  public readonly discovery: Array<{
    controller: Models.DiscoveryResult.Controller;
  }>;
  public readonly sliders: Array<{
    param: Models.SliderDescriptor;
    controller: Models.SliderDescriptor.Controller;
  }>;
  public readonly switches: Array<{
    param: Models.SwitchDescriptor;
    controller: Models.SwitchDescriptor.Controller;
  }>;
  public readonly textLabels: Array<{
    param: Models.TextLabelDescriptor;
    controller: { getter: Models.TextLabelDescriptor.Controller };
  }>;
  public readonly imageUrls: Array<{
    param: Models.ImageDescriptor;
    controller: { getter: Models.ImageDescriptor.Controller };
  }>;
  public readonly directories: Array<{
    param: Models.DirectoryDescriptor;
    controller: Models.DirectoryDescriptor.Controller;
  }>;
  public readonly registration: any[];
  public readonly additionalSearchTokens: string[];
  public readonly deviceCapabilities: string[];
  public readonly devicename: string;
  public buttonHandler?: Models.ButtonHandler;
  public hasPowerStateSensor: boolean;
  public manufacturer: string = DEFAULT_MANUFACTURER;
  public type = DEFAULT_TYPE;
  public setup: Models.DeviceSetup;
  public deviceSubscriptionHandlers?: Models.DeviceSubscriptionHandler.Controller;
  public driverVersion?: number;

  private icon?: string;
  private initializeFunction?: Models.InitialiseFunction;
  private subscriptionFunction?: Models.SubscriptionFunction;
  private specificname?: string;
  private timing?: Models.DeviceTiming;

  constructor(name: string, uniqueString?: string) {
    if (!validation.stringLength(name, MAXIMAL_STRING_LENGTH)) {
      throw new Error('DEVICENNAME_TOO_LONG');
    }
    this.deviceidentifier = `apt-${validation.getUniqueName(name, uniqueString)}`;
    this.devicename = name;
    this.directories = [];
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

  public setManufacturer(manufacturer = DEFAULT_MANUFACTURER) {
    if (!validation.stringLength(manufacturer, MAXIMAL_STRING_LENGTH)) {
      throw new Error('MANUFACTURER_NAME_TOO_LONG');
    }
    this.manufacturer = manufacturer;
    return this;
  }

  public setDriverVersion(version: number) {
    if (!validation.validateDriverVersion(version)) {
      throw new Error('DRIVER_VERSION_NOT_INTEGER_GREATER_THAN_0');
    }
    this.driverVersion = version;

    return this;
  }

  public setType(type: string = DEFAULT_TYPE) {
    this.type = validation.getDeviceType(type);
    return this;
  }

  public setIcon(iconName) {
    this.icon = validation.getIcon(iconName);
    return this;
  }

  public setSpecificName(specificname?: string) {
    if (specificname && !validation.stringLength(specificname, MAXIMAL_STRING_LENGTH)) {
      throw new Error('SPECIFIC_NAME_TOO_LONG');
    }
    this.specificname = specificname;
    return this;
  }

  public addAdditionalSearchToken(token: string) {
    this.additionalSearchTokens.push(token);
    return this;
  }

  public build(): Models.DeviceAdapterModel {
    const {
      buttons,
      buttonHandler,
      devicename,
      type,
      deviceidentifier,
      manufacturer,
      setup,
      additionalSearchTokens,
      deviceCapabilities,
      specificname,
      icon,
      timing,
      subscriptionFunction,
      initializeFunction: initialiseFunction,
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
    const { capabilities, handlers: handler } = buildDeviceCapabilities(this);
    const dynamicDeviceBuilderEnabled = this.setup.enableDynamicDeviceBuilder === true;
    if (!dynamicDeviceBuilderEnabled && capabilities.length === 0) {
      // empty capabilities are allowed only for dynamicDeviceBuilder
      throw new Error('INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES');
    }
    if (dynamicDeviceBuilderEnabled && capabilities.length > 0) {
      // in fact, empty capabilities are required when dynamicDeviceBuilder is enabled
      throw new Error('DYNAMICDEVICEBUILDER_ENABLED_DEVICES_MUST_NOT_HAVE_CAPABILITIES_DEFINED');
    }

    if (setup.registration) {
      deviceCapabilities.push('register-user-account');
    }
    if (
      validation.deviceTypeNeedsInputCommand(type) &&
      validation.hasNoInputButtonsDefined(buttons)
    ) {
      // tslint:disable-next-line
      console.warn(
        '\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!'
      );
      // tslint:disable-next-line
      console.warn(
        'WARNING: no input commands defined! Your device might not work as desired, check the docs'
      );
      // tslint:disable-next-line
      console.warn('Devicename:', devicename);
    }
    return {
      adapterName: deviceidentifier,
      apiversion: API_VERSION,
      type,
      manufacturer,
      driverVersion: this.driverVersion,
      setup,
      devices: [
        {
          name: devicename,
          tokens: additionalSearchTokens,
          specificname,
          icon,
        },
      ],
      capabilities,
      handler,
      deviceCapabilities,
      timing,
      subscriptionFunction,
      initialiseFunction,
    };
  }

  public enableDiscovery(
    options: {
      headerText?: string;
      description?: string;
      enableDynamicDeviceBuilder?: boolean;
    },
    controller: Models.DiscoveryResult.Controller
  ) {
    debug('enable discovery %o', options);
    if (typeof controller !== 'function') {
      throw new Error('INVALID_DISCOVERY_FUNCTION');
    }
    if (!options) {
      throw new Error('INVALID_DISCOVERY_PARAMETER');
    }
    const { headerText, description, enableDynamicDeviceBuilder } = options;
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
      introtext: description,
      enableDynamicDeviceBuilder: enableDynamicDeviceBuilder === true,
    });
    discovery.push({ controller });
    return this;
  }

  public supportsTiming() {
    return !validation.deviceTypeDoesNotSupportTiming(this.type);
  }

  public defineTiming(param: Models.TimingSpecifier) {
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
      standbyCommandDelay: !!powerOnDelayMs ? validateTime(powerOnDelayMs) : undefined,
      sourceSwitchDelay: !!sourceSwitchDelayMs ? validateTime(sourceSwitchDelayMs) : undefined,
      shutdownDelay: !!shutdownDelayMs ? validateTime(shutdownDelayMs) : undefined,
    };

    return this;
  }

  public registerSubscriptionFunction(controller: Models.SubscriptionFunction) {
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

  public registerInitialiseFunction(controller: Models.InitialiseFunction) {
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

  public registerDeviceSubscriptionHandler(
    controller: Models.DeviceSubscriptionHandler.Controller
  ) {
    debug('enable device subscriptions');
    if (this.deviceSubscriptionHandlers) {
      throw new Error('DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED');
    }
    if (!controller) {
      throw new Error('INVALID_SUBSCRIPTION_CONTROLLER_UNDEFINED');
    }
    const requiredFuncions: ReadonlyArray<keyof Models.DeviceSubscriptionHandler.Controller> = [
      'deviceAdded',
      'deviceRemoved',
      'initializeDeviceList',
    ];
    const missingFunctions = requiredFuncions.filter((functionName) => {
      return typeof controller[functionName] !== 'function';
    });
    if (missingFunctions.length) {
      throw new Error(
        `INVALID_SUBSCRIPTION_CONTROLLER missing ${missingFunctions.join(', ')} function(s)`
      );
    }
    this.deviceSubscriptionHandlers = controller;

    return this;
  }

  public addButton(param: Models.ButtonDescriptor) {
    debug('add button %o', param);
    checkParamName(param);
    checkOptionalLabel(param);

    this.buttons.push({ param });

    return this;
  }

  public addButtonGroup(groupName: string) {
    debug('add buttongroup with name', groupName);
    const buttonGroup = validation.getButtonGroup(groupName);
    if (Array.isArray(buttonGroup)) {
      buttonGroup.forEach((name) => this.addButton({ name }));
    }

    return this;
  }

  public addButtonHandler(controller: Models.ButtonHandler) {
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

  public enableRegistration(
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
    validation.validateRegistrationType(options.type);
    if (!options.headerText || !options.description) {
      throw new Error('MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION');
    }
    Object.assign(setup, {
      registration: true,
      registrationType: options.type,
      registrationHeader: options.headerText,
      registrationText: options.description,
    });

    registration.push({ controller });
    return this;
  }

  public addSlider(param: Models.SliderDescriptor, controller: Models.SliderDescriptor.Controller) {
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

  public addSensor(param: Models.SensorDescriptor, controller: Models.SensorDescriptor.Controller) {
    debug('add sensor %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller.getter !== 'function') {
      throw new Error(`INVALID_SENSOR_CONTROLLER: ${param.name}`);
    }

    this.sensors.push({ param, controller });

    return this;
  }

  public addPowerStateSensor(controller: Models.SensorDescriptor.PowerStateController) {
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

  public addSwitch(param: Models.SwitchDescriptor, controller: Models.SwitchDescriptor.Controller) {
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

  public addTextLabel(
    param: Models.TextLabelDescriptor,
    controller: Models.TextLabelDescriptor.Controller
  ) {
    debug('add textlabel %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_LABEL_CONTROLLER: ${param.name}`);
    }
    // NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter: controller } });
    return this;
  }

  public addImageUrl(param: Models.ImageDescriptor, controller: Models.ImageDescriptor.Controller) {
    debug('add imageurl %o', param);
    checkParamName(param);
    checkOptionalLabel(param);
    if (!controller || typeof controller !== 'function') {
      throw new Error(`INVALID_IMAGEURL_CONTROLLER: ${param.name}`);
    }
    this.imageUrls.push({ param, controller: { getter: controller } });
    return this;
  }

  public addDirectory(
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
      throw new Error(`INVALID_DIRECTORY_CONTROLLER_GETTER_NOT_A_FUNCTION: ${param.name}`);
    }
    if (typeof controller.action !== 'function') {
      throw new Error(`INVALID_DIRECTORY_CONTROLLER_ACTION_NOT_A_FUNCTION: ${param.name}`);
    }

    const addedDirectoryRole = param.role;
    if (addedDirectoryRole) {
      this.checkDirectoryRole(addedDirectoryRole);
    }

    this.directories.push({ param, controller });
    return this;
  }

  public addCapability(capability: string) {
    debug('add capability %o', capability);
    this.deviceCapabilities.push(validation.validateCapability(capability));
    return this;
  }

  /**
   * Do not break the SDK. This is a deprecated typo.
   * @param controller The button handler controller.
   */
  public addButtonHander(controller: Models.ButtonHandler) {
    this.addButtonHandler(controller);
  }

  private checkDirectoryRole(role) {
    validation.validateDirectoryRole(role);
    const roleAlreadyDefined = this.directories.find((directory) => directory.param.role === role);
    if (roleAlreadyDefined) {
      throw new Error(`INVALID_DIRECTORY_ROLE_ALREADY_DEFINED: ${role}`);
    }
  }
}
