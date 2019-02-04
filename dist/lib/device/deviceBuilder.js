"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var Models = require("../models");
var deviceCapability_1 = require("./deviceCapability");
var validation = require("./validation");
var debug = Debug('neeo:device:DeviceBuilder');
var MAXIMAL_STRING_LENGTH = validation.MAXIMAL_STRING_LENGTH;
var DEFAULT_MANUFACTURER = 'NEEO';
var DEFAULT_TYPE = 'ACCESSOIRE';
var API_VERSION = '1.0';
var PLAYER_BUTTON_NAMES = Models.PlayerWidget.playerButtonNames;
var PLAYER_VOLUME = Models.PlayerWidget.playerVolumeDefinition;
var PLAYER_COVER_ART = Models.PlayerWidget.coverArtDefinition;
var PLAYER_TITLE = Models.PlayerWidget.titleDefinition;
var PLAYER_DESCRIPTION = Models.PlayerWidget.descriptionDefinition;
var PLAYER_PLAYING = Models.PlayerWidget.playingDefinition;
var PLAYER_MUTE = Models.PlayerWidget.muteDefinition;
var PLAYER_SHUFFLE = Models.PlayerWidget.shuffleDefinition;
var PLAYER_REPEAT = Models.PlayerWidget.repeatDefinition;
var DeviceBuilder = (function () {
    function DeviceBuilder(name, uniqueString) {
        this.manufacturer = DEFAULT_MANUFACTURER;
        this.type = DEFAULT_TYPE;
        if (!validation.stringLength(name, MAXIMAL_STRING_LENGTH)) {
            throw new Error('DEVICENNAME_TOO_LONG');
        }
        this.deviceidentifier = "apt-" + validation.getUniqueName(name, uniqueString);
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
    DeviceBuilder.prototype.setManufacturer = function (manufacturer) {
        if (manufacturer === void 0) { manufacturer = DEFAULT_MANUFACTURER; }
        if (!validation.stringLength(manufacturer, MAXIMAL_STRING_LENGTH)) {
            throw new Error('MANUFACTURER_NAME_TOO_LONG');
        }
        this.manufacturer = manufacturer;
        return this;
    };
    DeviceBuilder.prototype.setDriverVersion = function (version) {
        if (!validation.validateDriverVersion(version)) {
            throw new Error('DRIVER_VERSION_NOT_INTEGER_GREATER_THAN_0');
        }
        this.driverVersion = version;
        return this;
    };
    DeviceBuilder.prototype.setType = function (type) {
        if (type === void 0) { type = DEFAULT_TYPE; }
        this.type = validation.getDeviceType(type);
        return this;
    };
    DeviceBuilder.prototype.setIcon = function (iconName) {
        this.icon = validation.getIcon(iconName);
        return this;
    };
    DeviceBuilder.prototype.setSpecificName = function (specificname) {
        if (specificname && !validation.stringLength(specificname, MAXIMAL_STRING_LENGTH)) {
            throw new Error('SPECIFIC_NAME_TOO_LONG');
        }
        this.specificname = specificname;
        return this;
    };
    DeviceBuilder.prototype.addAdditionalSearchToken = function (token) {
        this.additionalSearchTokens.push(token);
        return this;
    };
    DeviceBuilder.prototype.build = function () {
        var _a = this, buttons = _a.buttons, buttonHandler = _a.buttonHandler, devicename = _a.devicename, type = _a.type, deviceidentifier = _a.deviceidentifier, favoritesHandler = _a.favoritesHandler, manufacturer = _a.manufacturer, setup = _a.setup, additionalSearchTokens = _a.additionalSearchTokens, deviceCapabilities = _a.deviceCapabilities, specificname = _a.specificname, icon = _a.icon, timing = _a.timing, subscriptionFunction = _a.subscriptionFunction, initialiseFunction = _a.initializeFunction;
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
        var _b = deviceCapability_1.buildDeviceCapabilities(this), capabilities = _b.capabilities, handler = _b.handlers;
        var dynamicDeviceBuilderEnabled = this.setup.enableDynamicDeviceBuilder === true;
        if (!dynamicDeviceBuilderEnabled && capabilities.length === 0) {
            throw new Error('INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES');
        }
        if (dynamicDeviceBuilderEnabled && capabilities.length > 0) {
            throw new Error('DYNAMICDEVICEBUILDER_ENABLED_DEVICES_MUST_NOT_HAVE_CAPABILITIES_DEFINED');
        }
        if (setup.registration) {
            deviceCapabilities.push('register-user-account');
        }
        if (favoritesHandler) {
            deviceCapabilities.push('customFavoriteHandler');
        }
        if (validation.deviceTypeNeedsInputCommand(type) &&
            validation.hasNoInputButtonsDefined(buttons)) {
            console.warn('\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!\n' +
                'WARNING: no input commands defined! Your device might not work as\n' +
                'desired, check the docs.\n' +
                'Devicename:' + devicename);
        }
        return {
            adapterName: deviceidentifier,
            apiversion: API_VERSION,
            type: type,
            manufacturer: manufacturer,
            driverVersion: this.driverVersion,
            setup: setup,
            devices: [
                {
                    name: devicename,
                    tokens: additionalSearchTokens,
                    specificname: specificname,
                    icon: icon,
                },
            ],
            capabilities: capabilities,
            handler: handler,
            deviceCapabilities: deviceCapabilities,
            timing: timing,
            subscriptionFunction: subscriptionFunction,
            initialiseFunction: initialiseFunction,
        };
    };
    DeviceBuilder.prototype.enableDiscovery = function (options, controller) {
        debug('enable discovery %o', options);
        var _a = this, setup = _a.setup, discovery = _a.discovery;
        validation.checkNotYetDefined(setup.discovery, 'DISCOVERHANDLER');
        validation.validateDiscovery(options, controller);
        var headerText = options.headerText, description = options.description, enableDynamicDeviceBuilder = options.enableDynamicDeviceBuilder;
        this.setup = Object.assign(setup, {
            discovery: true,
            introheader: headerText,
            introtext: description,
            enableDynamicDeviceBuilder: enableDynamicDeviceBuilder === true,
        });
        discovery.push({ controller: controller });
        return this;
    };
    DeviceBuilder.prototype.supportsTiming = function () {
        return !validation.deviceTypeDoesNotSupportTiming(this.type);
    };
    DeviceBuilder.prototype.supportsFavorites = function () {
        return validation.deviceTypeHasFavoritesSupport(this.type);
    };
    DeviceBuilder.prototype.defineTiming = function (param) {
        debug('define timing %o', param);
        validation.validateTiming(param);
        this.timing = {
            standbyCommandDelay: param.powerOnDelayMs,
            sourceSwitchDelay: param.sourceSwitchDelayMs,
            shutdownDelay: param.shutdownDelayMs,
        };
        return this;
    };
    DeviceBuilder.prototype.registerSubscriptionFunction = function (controller) {
        debug('get subscription function');
        validation.checkNotYetDefined(this.subscriptionFunction, 'SUBSCRIPTIONHANDLER');
        validation.validateFunctionController(controller, 'SUBSCRIPTIONHANDLER');
        this.subscriptionFunction = controller;
        return this;
    };
    DeviceBuilder.prototype.registerInitialiseFunction = function (controller) {
        debug('get initialise function');
        validation.checkNotYetDefined(this.initializeFunction, 'INITIALISATIONHANDLER');
        validation.validateFunctionController(controller, 'INITIALISATIONHANDLER');
        this.initializeFunction = controller;
        return this;
    };
    DeviceBuilder.prototype.registerDeviceSubscriptionHandler = function (controller) {
        debug('enable device subscriptions');
        validation.checkNotYetDefined(this.deviceSubscriptionHandlers, 'DEVICESUBSCRIPTIONHANDLERS');
        validation.validateController(controller, {
            requiredFunctions: ['deviceAdded', 'deviceRemoved', 'initializeDeviceList'],
            handlerName: 'DEVICESUBSCRIPTION',
        });
        this.deviceSubscriptionHandlers = controller;
        return this;
    };
    DeviceBuilder.prototype.registerFavoriteHandlers = function (controller) {
        debug('enable favorite handlers');
        validation.checkNotYetDefined(this.favoritesHandler, 'FAVORITE_HANDLERS');
        validation.validateController(controller, {
            requiredFunctions: ['execute'],
            handlerName: 'FAVORITE',
        });
        this.favoritesHandler = controller;
        return this;
    };
    DeviceBuilder.prototype.addButton = function (param) {
        debug('add button %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        this.buttons.push({ param: param });
        return this;
    };
    DeviceBuilder.prototype.addButtonGroup = function (groupName) {
        var _this = this;
        debug('add buttongroup with name', groupName);
        var buttonGroup = validation.getButtonGroup(groupName);
        if (Array.isArray(buttonGroup)) {
            buttonGroup.forEach(function (name) { return _this.addButton({ name: name }); });
        }
        return this;
    };
    DeviceBuilder.prototype.addButtonHandler = function (controller) {
        debug('add buttonhandler');
        validation.checkNotYetDefined(this.buttonHandler, 'BUTTONHANDLER');
        validation.validateFunctionController(controller, 'BUTTONHANDLER');
        this.buttonHandler = controller;
        return this;
    };
    DeviceBuilder.prototype.enableRegistration = function (options, controller) {
        var _a = this, setup = _a.setup, registration = _a.registration;
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
        registration.push({ controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addSlider = function (param, controller) {
        debug('add slider %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        validation.validateController(controller, {
            requiredFunctions: ['setter', 'getter'],
            handlerName: 'SLIDER',
            componentName: param.name,
        });
        this.sliders.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addSensor = function (param, controller) {
        debug('add sensor %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        validation.validateController(controller, {
            requiredFunctions: ['getter'],
            handlerName: 'SENSOR',
            componentName: param.name,
        });
        this.sensors.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addPowerStateSensor = function (controller) {
        debug('add power sensor');
        validation.validateController(controller, {
            requiredFunctions: ['getter'],
            handlerName: 'POWERSENSOR',
        });
        var param = {
            name: 'powerstate',
            label: 'Powerstate',
            type: 'power',
        };
        this.sensors.push({ param: param, controller: controller });
        this.hasPowerStateSensor = true;
        return this;
    };
    DeviceBuilder.prototype.addSwitch = function (param, controller) {
        debug('add switch %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        validation.validateController(controller, {
            requiredFunctions: ['setter', 'getter'],
            handlerName: 'SWITCH',
            componentName: param.name,
        });
        this.switches.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addTextLabel = function (param, getter) {
        debug('add textlabel %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        validation.validateFunctionController(getter, "TEXTLABELHANDLER: " + param.name);
        this.textLabels.push({ param: param, controller: { getter: getter } });
        return this;
    };
    DeviceBuilder.prototype.addImageUrl = function (param, getter) {
        debug('add imageurl %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param);
        validation.validateFunctionController(getter, "IMAGEURLHANDLER: " + param.name);
        this.imageUrls.push({ param: param, controller: { getter: getter } });
        return this;
    };
    DeviceBuilder.prototype.addDirectory = function (param, controller) {
        debug('add directory %o', param);
        validation.checkNameFor(param);
        validation.checkLabelFor(param, { mandatory: true });
        validation.validateController(controller, {
            requiredFunctions: ['getter', 'action'],
            handlerName: 'DIRECTORY',
            componentName: param.name,
        });
        var addedDirectoryRole = param.role;
        if (addedDirectoryRole) {
            this.checkDirectoryRole(addedDirectoryRole);
        }
        this.directories.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addQueueDirectory = function (params, controller) {
        console.warn('WARNING: addQueueDirectory() is deprecated in favor of ' +
            'addDirectory() and will be removed in future versions.');
        var bridgeParams = Object.assign({ role: 'QUEUE' }, params);
        return this.addDirectory(bridgeParams, controller);
    };
    DeviceBuilder.prototype.addRootDirectory = function (params, controller) {
        console.warn('WARNING: addRootDirectory() is deprecated in favor of ' +
            'addDirectory() and will be removed in future versions.');
        var bridgeParams = Object.assign({ role: 'ROOT' }, params);
        return this.addDirectory(bridgeParams, controller);
    };
    DeviceBuilder.prototype.addCapability = function (capability) {
        debug('add capability %o', capability);
        this.deviceCapabilities.push(validation.validateCapability(capability));
        return this;
    };
    DeviceBuilder.prototype.addPlayerWidget = function (handler) {
        var _this = this;
        debug('adding player widget components');
        validation.checkNotYetDefined(this.validatePlayerWidget, 'PLAYER_WIDGET');
        validation.validatePlayerWidget(handler);
        this.addDirectory({
            name: handler.rootDirectory.name || 'ROOT_DIRECTORY',
            label: handler.rootDirectory.label || 'ROOT',
            role: 'ROOT',
        }, handler.rootDirectory.controller);
        var queueDirectory = handler.queueDirectory;
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
        PLAYER_BUTTON_NAMES.forEach(function (name) {
            _this.addButton({ name: name });
        });
        this.validatePlayerWidget = true;
        return this;
    };
    DeviceBuilder.prototype.addButtonHander = function (controller) {
        this.addButtonHandler(controller);
    };
    DeviceBuilder.prototype.checkDirectoryRole = function (role) {
        validation.validateDirectoryRole(role);
        var roleAlreadyDefined = this.directories.find(function (directory) { return directory.param.role === role; });
        if (roleAlreadyDefined) {
            throw new Error("INVALID_DIRECTORY_ROLE_ALREADY_DEFINED: " + role);
        }
    };
    return DeviceBuilder;
}());
exports.DeviceBuilder = DeviceBuilder;
//# sourceMappingURL=deviceBuilder.js.map