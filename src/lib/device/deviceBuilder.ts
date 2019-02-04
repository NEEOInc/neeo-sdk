import * as Debug from 'debug';
import * as Models from '../models';
import { buildDeviceCapabilities } from './deviceCapability';
import * as validation from './validation';

const debug = Debug('neeo:device:DeviceBuilder');

const MAXIMAL_STRING_LENGTH = validation.MAXIMAL_STRING_LENGTH;
const DEFAULT_MANUFACTURER = 'NEEO';
const DEFAULT_TYPE: Models.DeviceType = 'ACCESSOIRE';
const API_VERSION = '1.0';
const PLAYER_BUTTON_NAMES = Models.PlayerWidget.playerButtonNames;
const PLAYER_VOLUME = Models.PlayerWidget.playerVolumeDefinition;
const PLAYER_COVER_ART = Models.PlayerWidget.coverArtDefinition;
const PLAYER_TITLE = Models.PlayerWidget.titleDefinition;
const PLAYER_DESCRIPTION = Models.PlayerWidget.descriptionDefinition;
const PLAYER_PLAYING = Models.PlayerWidget.playingDefinition;
const PLAYER_MUTE = Models.PlayerWidget.muteDefinition;
const PLAYER_SHUFFLE = Models.PlayerWidget.shuffleDefinition;
const PLAYER_REPEAT = Models.PlayerWidget.repeatDefinition;

export class DeviceBuilder implements Models.DeviceBuilder {
  public readonly buttons: Array<{ param: Models.ButtonDescriptor }>;
  public readonly deviceidentifier: string;
  public readonly sensors: Array<{
    param: Models.Sensor.Descriptor;
    controller: Models.Sensor.Controller;
  }>;
  public readonly discovery: Array<{
    controller: Models.Discovery.Controller;
  }>;
  public readonly sliders: Array<{
    param: Models.Slider.Descriptor;
    controller: Models.Slider.Controller;
  }>;
  public readonly switches: Array<{
    param: Models.Descriptor;
    controller: Models.Switch.Controller;
  }>;
  public readonly textLabels: Array<{
    param: Models.TextLabel.Descriptor;
    controller: { getter: Models.TextLabel.Controller };
  }>;
  public readonly imageUrls: Array<{
    param: Models.Image.Descriptor;
    controller: { getter: Models.Image.Controller };
  }>;
  public readonly directories: Array<{
    param: Models.Directory.Descriptor;
    controller: Models.Directory.Controller;
  }>;
  public readonly registration: any[];
  public readonly additionalSearchTokens: string[];
  public readonly deviceCapabilities: Models.DeviceCapability[];
  public readonly devicename: string;
  public buttonHandler?: Models.ButtonHandler;
  public hasPowerStateSensor: boolean;
  public manufacturer: string = DEFAULT_MANUFACTURER;
  public type = DEFAULT_TYPE;
  public setup: Models.DeviceSetup;
  public deviceSubscriptionHandlers?: Models.DeviceSubscriptionHandler.Controller;
  public favoritesHandler?: Models.FavoritesHandler.Controller;
  public driverVersion?: number;

  private icon?: string;
  private initializeFunction?: Models.InitialiseFunction;
  private subscriptionFunction?: Models.Subscription.Controller;
  private specificname?: string;
  private timing?: Models.DeviceTiming;
  private validatePlayerWidget?: boolean;

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
      favoritesHandler,
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
    if (favoritesHandler && !validation.deviceTypeHasFavoritesSupport(type)) {
      throw new Error('FAVORITES_HANDLER_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT');
    }
    if (this.validatePlayerWidget && !validation.deviceTypeHasPlayerSupport(type)) {
      throw new Error('INVALID_DEVICE_TYPE_FOR_PLAYER_WIDGET_' + type);
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
    if (favoritesHandler) {
      deviceCapabilities.push('customFavoriteHandler');
    }

    if (
      validation.deviceTypeNeedsInputCommand(type) &&
      validation.hasNoInputButtonsDefined(buttons)
    ) {
      // tslint:disable-next-line
      console.warn(
        '\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!\n' +
        'WARNING: no input commands defined! Your device might not work as\n' +
        'desired, check the docs.\n' +
        'Devicename:' + devicename
      );
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
    options: Models.Discovery.Options,
    controller: Models.Discovery.Controller
  ) {
    debug('enable discovery %o', options);
    const { setup, discovery } = this;
    validation.checkNotYetDefined(setup.discovery, 'DISCOVERHANDLER');
    validation.validateDiscovery(options, controller);
    const { headerText, description, enableDynamicDeviceBuilder } = options;
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

  public supportsFavorites() {
    return validation.deviceTypeHasFavoritesSupport(this.type);
  }

  public defineTiming(param: Models.TimingSpecifier) {
    debug('define timing %o', param);
    validation.validateTiming(param);
    this.timing = {
      standbyCommandDelay: param.powerOnDelayMs,
      sourceSwitchDelay: param.sourceSwitchDelayMs,
      shutdownDelay: param.shutdownDelayMs,
    };

    return this;
  }

  public registerSubscriptionFunction(controller: Models.Subscription.Controller) {
    debug('get subscription function');
    validation.checkNotYetDefined(this.subscriptionFunction, 'SUBSCRIPTIONHANDLER');
    validation.validateFunctionController(controller, 'SUBSCRIPTIONHANDLER');
    this.subscriptionFunction = controller;

    return this;
  }

  public registerInitialiseFunction(controller: Models.InitialiseFunction) {
    debug('get initialise function');
    validation.checkNotYetDefined(this.initializeFunction, 'INITIALISATIONHANDLER');
    validation.validateFunctionController(controller, 'INITIALISATIONHANDLER');
    this.initializeFunction = controller;

    return this;
  }

  public registerDeviceSubscriptionHandler(
    controller: Models.DeviceSubscriptionHandler.Controller
  ) {
    debug('enable device subscriptions');
    validation.checkNotYetDefined(this.deviceSubscriptionHandlers, 'DEVICESUBSCRIPTIONHANDLERS');
    validation.validateController(controller, {
      requiredFunctions: ['deviceAdded', 'deviceRemoved', 'initializeDeviceList'],
      handlerName: 'DEVICESUBSCRIPTION',
    });
    this.deviceSubscriptionHandlers = controller;

    return this;
  }

  public registerFavoriteHandlers(
    controller: Models.FavoritesHandler.Controller
  ) {
    debug('enable favorite handlers');
    validation.checkNotYetDefined(this.favoritesHandler, 'FAVORITE_HANDLERS');
    validation.validateController(controller, {
      requiredFunctions: ['execute'],
      handlerName: 'FAVORITE',
    });
    this.favoritesHandler = controller;

    return this;
  }

  public addButton(param: Models.ButtonDescriptor) {
    debug('add button %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);

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
    validation.checkNotYetDefined(this.buttonHandler, 'BUTTONHANDLER');
    validation.validateFunctionController(controller, 'BUTTONHANDLER');
    this.buttonHandler = controller;

    return this;
  }

  public enableRegistration(
    options: Models.Registration.Options,
    controller: Models.Registration.Controller
  ) {
    const { setup, registration } = this;
    debug('enable registration %o', options);
    validation.checkNotYetDefined(setup.registration, 'REGISTERHANLDER');
    validation.validateController(controller, {
      requiredFunctions: ['register', 'isRegistered'],
      handlerName: 'REGISTRATION',
    });

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

  public addSlider(param: Models.Slider.Descriptor, controller: Models.Slider.Controller) {
    debug('add slider %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);
    validation.validateController(controller, {
      requiredFunctions: ['setter', 'getter'],
      handlerName: 'SLIDER',
      componentName: param.name,
    });

    this.sliders.push({ param, controller });

    return this;
  }

  public addSensor(param: Models.Sensor.Descriptor, controller: Models.Sensor.Controller) {
    debug('add sensor %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);
    validation.validateController(controller, {
      requiredFunctions: ['getter'],
      handlerName: 'SENSOR',
      componentName: param.name,
    });

    this.sensors.push({ param, controller });

    return this;
  }

  public addPowerStateSensor(controller: Models.Sensor.PowerStateController) {
    debug('add power sensor');
    validation.validateController(controller, {
      requiredFunctions: ['getter'],
      handlerName: 'POWERSENSOR',
    });

    const param = {
      name: 'powerstate',
      label: 'Powerstate',
      type: 'power',
    };
    this.sensors.push({ param, controller });
    this.hasPowerStateSensor = true;

    return this;
  }

  public addSwitch(param: Models.Descriptor, controller: Models.Switch.Controller) {
    debug('add switch %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);
    validation.validateController(controller, {
      requiredFunctions: ['setter', 'getter'],
      handlerName: 'SWITCH',
      componentName: param.name,
    });

    this.switches.push({ param, controller });
    return this;
  }

  public addTextLabel(
    param: Models.TextLabel.Descriptor,
    getter: Models.TextLabel.Controller
  ) {
    debug('add textlabel %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);
    validation.validateFunctionController(getter, `TEXTLABELHANDLER: ${param.name}`);
    // NOTE: we need a controller getter here
    this.textLabels.push({ param, controller: { getter } });
    return this;
  }

  public addImageUrl(param: Models.Image.Descriptor, getter: Models.Image.Controller) {
    debug('add imageurl %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param);
    validation.validateFunctionController(getter, `IMAGEURLHANDLER: ${param.name}`);
    this.imageUrls.push({ param, controller: { getter } });
    return this;
  }

  public addDirectory(
    param: Models.Directory.Descriptor,
    controller: Models.Directory.Controller
  ) {
    debug('add directory %o', param);
    validation.checkNameFor(param);
    validation.checkLabelFor(param, { mandatory: true });
    validation.validateController(controller, {
      requiredFunctions: ['getter', 'action'],
      handlerName: 'DIRECTORY',
      componentName: param.name,
    });

    const addedDirectoryRole = param.role;
    if (addedDirectoryRole) {
      this.checkDirectoryRole(addedDirectoryRole);
    }

    this.directories.push({ param, controller });
    return this;
  }

  /**
   * @deprecated
   */
  public addQueueDirectory(
    params: Models.Directory.Descriptor,
    controller: Models.Directory.Controller
  ) {
    // tslint:disable-next-line
    console.warn('WARNING: addQueueDirectory() is deprecated in favor of ' +
      'addDirectory() and will be removed in future versions.');
    const bridgeParams = Object.assign({ role: 'QUEUE' }, params);
    return this.addDirectory(bridgeParams, controller);
  }

  /**
   * @deprecated
   */
  public addRootDirectory(
    params: Models.Directory.Descriptor,
    controller: Models.Directory.Controller
  ) {
    // tslint:disable-next-line
    console.warn('WARNING: addRootDirectory() is deprecated in favor of ' +
      'addDirectory() and will be removed in future versions.');
    const bridgeParams = Object.assign({ role: 'ROOT' }, params);
    return this.addDirectory(bridgeParams, controller);
  }

  public addCapability(capability: Models.DeviceStaticCapability) {
    debug('add capability %o', capability);
    this.deviceCapabilities.push(validation.validateCapability(capability));
    return this;
  }

  public addPlayerWidget(handler: Models.PlayerWidget.Controller) {
    debug('adding player widget components');
    validation.checkNotYetDefined(this.validatePlayerWidget, 'PLAYER_WIDGET');
    validation.validatePlayerWidget(handler);

    this.addDirectory({
      name: handler.rootDirectory.name || 'ROOT_DIRECTORY',
      label: handler.rootDirectory.label || 'ROOT',
      role: 'ROOT',
    }, handler.rootDirectory.controller);

    const queueDirectory = handler.queueDirectory;
    if (queueDirectory) {
      this.addDirectory({
        name: queueDirectory.name || 'QUEUE_DIRECTORY',
        label: queueDirectory.label || 'QUEUE',
        role: 'QUEUE',
      }, queueDirectory.controller);
    }

    this.addSlider(PLAYER_VOLUME, handler.volumeController);

    this.addSensor(PLAYER_COVER_ART, handler.coverArtController);
    this.addSensor(PLAYER_DESCRIPTION, handler.descriptionController);
    this.addSensor(PLAYER_TITLE, handler.titleController);

    this.addSwitch(PLAYER_PLAYING, handler.playingController);
    this.addSwitch(PLAYER_MUTE, handler.muteController);
    this.addSwitch(PLAYER_SHUFFLE, handler.shuffleController);
    this.addSwitch(PLAYER_REPEAT, handler.repeatController);

    PLAYER_BUTTON_NAMES.forEach((name) => {
      this.addButton({ name });
    });

    this.validatePlayerWidget = true;
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
