"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var deviceCapability_1 = require("./deviceCapability");
var validation = require("./validation");
var debug = Debug('neeo:device:DeviceBuilder');
var MAXIMAL_STRING_LENGTH = 48;
var DEFAULT_MANUFACTURER = 'NEEO';
var DEFAULT_TYPE = 'ACCESSOIRE';
var API_VERSION = '1.0';
var MAXIMAL_TIMING_VALUE_MS = 60 * 1000;
function checkParamName(param) {
    if (!param || !param.name) {
        throw new Error('MISSING_ELEMENT_NAME');
    }
    if (!validation.stringLength(param.name, MAXIMAL_STRING_LENGTH)) {
        throw new Error('NAME_TOO_LONG_' + param.name);
    }
}
function checkOptionalLabel(param) {
    if (!param || !param.label) {
        return;
    }
    if (!validation.stringLength(param.label, MAXIMAL_STRING_LENGTH)) {
        throw new Error('LABEL_TOO_LONG_' + param.label);
    }
}
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
        var _a = this, buttons = _a.buttons, buttonHandler = _a.buttonHandler, devicename = _a.devicename, type = _a.type, deviceidentifier = _a.deviceidentifier, manufacturer = _a.manufacturer, setup = _a.setup, additionalSearchTokens = _a.additionalSearchTokens, deviceCapabilities = _a.deviceCapabilities, specificname = _a.specificname, icon = _a.icon, timing = _a.timing, subscriptionFunction = _a.subscriptionFunction, initialiseFunction = _a.initializeFunction;
        if (timing && validation.deviceTypeDoesNotSupportTiming(type)) {
            throw new Error('TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT');
        }
        if (buttons.length && !buttonHandler) {
            throw new Error('BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED');
        }
        if (setup.registration && !setup.discovery) {
            throw new Error('REGISTRATION_ENABLED_MISSING_DISCOVERY_STEP');
        }
        var _b = deviceCapability_1.default(this), capabilities = _b.capabilities, handler = _b.handlers;
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
        if (validation.deviceTypeNeedsInputCommand(type) &&
            validation.hasNoInputButtonsDefined(buttons)) {
            console.warn('\nWARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!');
            console.warn('WARNING: no input commands defined! Your device might not work as desired, check the docs');
            console.warn('Devicename:', devicename);
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
        if (typeof controller !== 'function') {
            throw new Error('INVALID_DISCOVERY_FUNCTION');
        }
        if (!options) {
            throw new Error('INVALID_DISCOVERY_PARAMETER');
        }
        var headerText = options.headerText, description = options.description, enableDynamicDeviceBuilder = options.enableDynamicDeviceBuilder;
        if (!headerText || !description) {
            throw new Error('INVALID_DISCOVERY_PARAMETER');
        }
        var _a = this, setup = _a.setup, discovery = _a.discovery;
        if (setup.discovery) {
            throw new Error('DISCOVERHANDLER_ALREADY_DEFINED');
        }
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
    DeviceBuilder.prototype.defineTiming = function (param) {
        if (!param) {
            throw new Error('INVALID_TIMING_PARAMETER');
        }
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
        var powerOnDelayMs = param.powerOnDelayMs, sourceSwitchDelayMs = param.sourceSwitchDelayMs, shutdownDelayMs = param.shutdownDelayMs;
        if (!powerOnDelayMs && !sourceSwitchDelayMs && !shutdownDelayMs) {
            throw new Error('INVALID_TIMING_PARAMETER');
        }
        this.timing = {
            standbyCommandDelay: !!powerOnDelayMs ? validateTime(powerOnDelayMs) : undefined,
            sourceSwitchDelay: !!sourceSwitchDelayMs ? validateTime(sourceSwitchDelayMs) : undefined,
            shutdownDelay: !!shutdownDelayMs ? validateTime(shutdownDelayMs) : undefined,
        };
        return this;
    };
    DeviceBuilder.prototype.registerSubscriptionFunction = function (controller) {
        debug('get subscription function');
        if (typeof controller !== 'function') {
            throw new Error('INVALID_SUBSCRIPTIONHANDLER_FUNCTION');
        }
        if (this.subscriptionFunction) {
            throw new Error('SUBSCRIPTIONHANDLER_ALREADY_DEFINED');
        }
        this.subscriptionFunction = controller;
        return this;
    };
    DeviceBuilder.prototype.registerInitialiseFunction = function (controller) {
        debug('get initialise function');
        if (typeof controller !== 'function') {
            throw new Error('INVALID_INITIALISATION_FUNCTION');
        }
        if (this.initializeFunction) {
            throw new Error('INITIALISATION_FUNCTION_ALREADY_DEFINED');
        }
        this.initializeFunction = controller;
        return this;
    };
    DeviceBuilder.prototype.registerDeviceSubscriptionHandler = function (controller) {
        debug('enable device subscriptions');
        if (this.deviceSubscriptionHandlers) {
            throw new Error('DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED');
        }
        if (!controller) {
            throw new Error('INVALID_SUBSCRIPTION_CONTROLLER_UNDEFINED');
        }
        var requiredFuncions = [
            'deviceAdded',
            'deviceRemoved',
            'initializeDeviceList',
        ];
        var missingFunctions = requiredFuncions.filter(function (functionName) {
            return typeof controller[functionName] !== 'function';
        });
        if (missingFunctions.length) {
            throw new Error("INVALID_SUBSCRIPTION_CONTROLLER missing " + missingFunctions.join(', ') + " function(s)");
        }
        this.deviceSubscriptionHandlers = controller;
        return this;
    };
    DeviceBuilder.prototype.addButton = function (param) {
        debug('add button %o', param);
        checkParamName(param);
        checkOptionalLabel(param);
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
        if (typeof controller !== 'function') {
            throw new Error('MISSING_BUTTONHANDLER_CONTROLLER_PARAMETER');
        }
        if (this.buttonHandler) {
            throw new Error('BUTTONHANDLER_ALREADY_DEFINED');
        }
        this.buttonHandler = controller;
        return this;
    };
    DeviceBuilder.prototype.enableRegistration = function (options, controller) {
        var _a = this, setup = _a.setup, registration = _a.registration;
        debug('enable registration %o', options);
        if (setup.registration) {
            throw new Error('REGISTERHANLDER_ALREADY_DEFINED');
        }
        if (!controller ||
            typeof controller.register !== 'function' ||
            typeof controller.isRegistered !== 'function') {
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
        registration.push({ controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addSlider = function (param, controller) {
        debug('add slider %o', param);
        checkParamName(param);
        checkOptionalLabel(param);
        if (!controller ||
            typeof controller.setter !== 'function' ||
            typeof controller.getter !== 'function') {
            throw new Error("INVALID_SLIDER_CONTROLLER: " + param.name);
        }
        this.sliders.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addSensor = function (param, controller) {
        debug('add sensor %o', param);
        checkParamName(param);
        checkOptionalLabel(param);
        if (!controller || typeof controller.getter !== 'function') {
            throw new Error("INVALID_SENSOR_CONTROLLER: " + param.name);
        }
        this.sensors.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addPowerStateSensor = function (controller) {
        debug('add power sensor');
        if (!controller || typeof controller.getter !== 'function') {
            throw new Error('INVALID_POWERSENSOR_CONTROLLER');
        }
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
        checkParamName(param);
        checkOptionalLabel(param);
        if (!controller ||
            typeof controller.setter !== 'function' ||
            typeof controller.getter !== 'function') {
            throw new Error("INVALID_SWITCH_CONTROLLER: " + param.name);
        }
        this.switches.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addTextLabel = function (param, controller) {
        debug('add textlabel %o', param);
        checkParamName(param);
        checkOptionalLabel(param);
        if (!controller || typeof controller !== 'function') {
            throw new Error("INVALID_LABEL_CONTROLLER: " + param.name);
        }
        this.textLabels.push({ param: param, controller: { getter: controller } });
        return this;
    };
    DeviceBuilder.prototype.addImageUrl = function (param, controller) {
        debug('add imageurl %o', param);
        checkParamName(param);
        checkOptionalLabel(param);
        if (!controller || typeof controller !== 'function') {
            throw new Error("INVALID_IMAGEURL_CONTROLLER: " + param.name);
        }
        this.imageUrls.push({ param: param, controller: { getter: controller } });
        return this;
    };
    DeviceBuilder.prototype.addDirectory = function (param, controller) {
        debug('add directory %o', param);
        checkParamName(param);
        if (!param.label) {
            throw new Error('MISSING_DIRECTORY_LABEL');
        }
        if (!validation.stringLength(param.label, MAXIMAL_STRING_LENGTH)) {
            throw new Error('DIRECTORY_LABEL_TOO_LONG_' + param.label);
        }
        if (!controller) {
            throw new Error("INVALID_DIRECTORY_CONTROLLER: " + param.name);
        }
        if (typeof controller.getter !== 'function') {
            throw new Error("INVALID_DIRECTORY_CONTROLLER_GETTER_NOT_A_FUNCTION: " + param.name);
        }
        if (typeof controller.action !== 'function') {
            throw new Error("INVALID_DIRECTORY_CONTROLLER_ACTION_NOT_A_FUNCTION: " + param.name);
        }
        var addedDirectoryRole = param.role;
        if (addedDirectoryRole) {
            this.checkDirectoryRole(addedDirectoryRole);
        }
        this.directories.push({ param: param, controller: controller });
        return this;
    };
    DeviceBuilder.prototype.addCapability = function (capability) {
        debug('add capability %o', capability);
        this.deviceCapabilities.push(validation.validateCapability(capability));
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