import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { DeviceBuilder } from '../../../../src/lib/device/deviceBuilder';
import ListBuilder from '../../../../src/lib/device/lists/listBuilder';
import * as validation from '../../../../src/lib/device/validation';
import { PlayerWidget } from '../../../../src/lib/models';

const DUMMY_ADAPTER_NAME = 'apt-0d4c188e6b135d523010726da6cb4bd358bbd7d3';
const INVALIDLY_LONG_STRING =
  'disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf';
const expect = chai.expect;
chai.use(sinonChai);
// tslint:disable:max-line-length

describe('./lib/device/deviceBuilder.ts', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.spy(validation, 'validateController');
    sandbox.spy(validation, 'validateDiscovery');
    sandbox.spy(validation, 'validatePlayerWidget');
    sandbox.spy(validation, 'validateTiming');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should reject device with no capabilities', () => {
    expect(() => {
      generateDummyDevice({})
        .build();
    }).to.throw(/INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES/);
  });

  it('should reject invalid devicetype', () => {
    expect(() => {
      generateDummyDevice({ type: 'foo' })
        .build();
    }).to.throw(/INVALID_DEVICETYPE/);
  });

  it('should reject device with name too long', () => {
    expect(() => {
      new DeviceBuilder('example-adapter-' + INVALIDLY_LONG_STRING)
        .build();
    }).to.throw(/DEVICENNAME_TOO_LONG/);
  });

  it('should reject device with invalid specific name', () => {
    expect(() => {
      generateDummyDevice({})
        .setSpecificName('example-adapter-' + INVALIDLY_LONG_STRING)
        .build();
    }).to.throw(/SPECIFIC_NAME_TOO_LONG/);
  });

  describe('enableDiscovery', () => {
    it('should build device without capabilities for dynamic device', () => {
      const discoverSetting = {
        description: 'foo',
        headerText: 'bar',
        enableDynamicDeviceBuilder: true,
      };
      const result = generateDummyDevice({})
        .enableDiscovery(discoverSetting, () => [])
        .build();
      expect(result.setup.enableDynamicDeviceBuilder).to.equal(true);
      expect(validation.validateDiscovery).to.have.been.calledOnce;
    });

    it('should reject dynamic device with additional capabilities defined', () => {
      const discoverSetting = {
        description: 'foo',
        headerText: 'bar',
        enableDynamicDeviceBuilder: true,
      };
      expect(() => {
        generateDummyDevice({})
          .enableDiscovery(discoverSetting, () => [])
          .addButton({ name: 'example-button', label: 'my%20button' })
          .addButtonHandler(() => {})
          .build();
      }).to.throw(
        /DYNAMICDEVICEBUILDER_ENABLED_DEVICES_MUST_NOT_HAVE_CAPABILITIES_DEFINED/
      );
    });

    it('should reject multiple calls to enableDiscovery', () => {
      expect(() => {
        generateDummyDevice({})
          .enableDiscovery({ headerText: 'x', description: 'x' }, () => [])
          .enableDiscovery({ headerText: 'x', description: 'x' }, () => []);
      }).to.throw(/DISCOVERHANDLER_ALREADY_DEFINED/);
    });
  });

  describe('addButton', () => {
    it('should reject device with invalid capability name (button)', () => {
      expect(() => {
        generateDummyDevice({ addButton: true })
          .addButton({
            name: 'example-button-' + INVALIDLY_LONG_STRING,
            label: 'my%20button',
          })
          .build();
      }).to.throw(/NAME_TOO_LONG_example-button-/);
    });

    it('should reject device with invalid capability label (button)', () => {
      expect(() => {
        generateDummyDevice({ addButton: true })
          .addButton({
            name: 'example-button',
            label: 'my button ' + INVALIDLY_LONG_STRING,
          })
          .build();
      }).to.throw(/LABEL_TOO_LONG_my button /);
    });

    it('should reject device with missing button controller', () => {
      expect(() => {
        generateDummyDevice({})
          .addButton({ name: 'run-one', label: 'button one' })
          .addButton({ name: 'run-two', label: 'button two' })
          .build();
      }).to.throw(/BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED/);
    });

    it('should reject device with duplicate names (button)', () => {
      expect(() => {
        generateDummyDevice({ addButton: true })
          .addButton({ name: 'example-button', label: 'my button' })
          .addButton({ name: 'example-button', label: 'my button' })
          .build();
      }).to.throw(/DUPLICATE_PATH_DETECTED/);
    });

    it('should reject device with multiple buttonhandler', () => {
      expect(() => {
        generateDummyDevice({ addButton: true })
          .addButtonHandler(() => {});
      }).to.throw(/BUTTONHANDLER_ALREADY_DEFINED/);
    });

    it('should reject device with controller is not a function', () => {
      expect(() => {
        generateDummyDevice({})
          .addButton({ name: 'example-button', label: 'my%20button' })
          // @ts-ignore
          .addButtonHandler(1)
          .build();
      }).to.throw(/INVALID_CONTROLLER_FUNCTION_BUTTONHANDLER/);
    });

    it('should build device with a button', () => {
      const device = generateDummyDevice({ type: 'light' })
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(() => {})
        .build();

      // @ts-ignore
      delete device.handler;
      // @ts-ignore
      delete device.subscriptionFunction;

      expect(device).to.deep.equal({
        adapterName: DUMMY_ADAPTER_NAME,
        apiversion: '1.0',
        type: 'LIGHT',
        initialiseFunction: undefined,
        manufacturer: 'NEEO',
        driverVersion: undefined,
        setup: {},
        timing: undefined,
        deviceCapabilities: [],
        devices: [{
          name: 'example-adapter',
          specificname: undefined,
          icon: undefined,
          tokens: ['foo', 'bar'],
        }],
        capabilities: [{
          type: 'button',
          name: 'example-button',
          label: 'my%20button',
          path: '/device/' + DUMMY_ADAPTER_NAME + '/example-button',
        }],
      });
    });
  });

  describe('addTextLabel', () => {
    it('should reject device with invalid capability name', () => {
      expect(() => {
        generateDummyDevice({})
          .addTextLabel(
            {
              name: 'labelname ' + INVALIDLY_LONG_STRING,
              label: 'label',
            },
            () => 'label'
          )
          .build();
      }).to.throw(/NAME_TOO_LONG_labelname /);
    });

    it('should reject device with invalid capability label', () => {
      expect(() => {
        generateDummyDevice({})
          .addTextLabel(
            {
              name: 'labelname',
              label: 'label ' + INVALIDLY_LONG_STRING,
            },
            () => 'label'
          )
          .build();
      }).to.throw(/LABEL_TOO_LONG_label /);
    });

    it('should build device with a text label', () => {
      const device = generateDummyDevice({ addLabel: true })
        .build();

      const handler = device.handler.get('NAME_SENSOR');
      expect(typeof handler!.controller.getter).to.equal('function');
      expect(device.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'NAME_SENSOR',
          label: 'label',
          path: '/device/' + DUMMY_ADAPTER_NAME + '/NAME_SENSOR',
          sensor: { type: 'string' },
        },
        {
          type: 'textlabel',
          name: 'name',
          label: 'label',
          isLabelVisible: undefined,
          path: '/device/' + DUMMY_ADAPTER_NAME + '/name',
          sensor: 'NAME_SENSOR',
        },
      ]);
    });

    it('should build a device with a text label when isLabelVisible is set to false', () => {
      const device = generateDummyDevice({})
        .addTextLabel(
          { name: 'labelname', label: 'label', isLabelVisible: false },
          () => 'label'
        )
        .build();

      expect(device).to.have.nested.property('capabilities[1].isLabelVisible', false);
    });
  });

  describe('addDirectory', () => {
    let controller;
    let params;

    beforeEach(() => {
      controller = { getter: () => new ListBuilder(), action: () => {} };
      params = { name: 'example-directory', label: 'my directory' };
    });

    it('should reject directory missing name', () => {
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .addDirectory({}, controller);
      }).to.throw(/MISSING_ELEMENT_NAME/);
    });

    it('should reject directory missing label', () => {
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .addDirectory({ name: 'foo' }, controller);
      }).to.throw(/MISSING_COMPONENT_LABEL/);
    });

    it('should reject directory with invalid label', () => {
      const longLabel = 'erbfeirufbuierbfeirubfierubfiuerbfiuerbfiuerbfiuerbfi' +
        'uerbfiuerbfieurbfiuerbfiuerbfbeirubfi';
      expect(() => {
        generateDummyDevice({})
          .addDirectory({ name: 'foo', label: longLabel }, controller);
      }).to.throw(/LABEL_TOO_LONG_\w+/);
    });

    it('should build device with a directory', () => {
      const device = generateDummyDevice({})
        .addDirectory(params, controller)
        .build();

      expect(device.capabilities).to.deep.equal([{
        identifier: undefined,
        role: undefined,
        label: 'my%20directory',
        name: 'example-directory',
        path: '/device/' + DUMMY_ADAPTER_NAME + '/example-directory',
        type: 'directory',
      }]);
    });

    it('should fail to add a directory with an already existing role', () => {
      params.role = 'ROOT';
      expect(() => {
        generateDummyDevice({})
          .addDirectory(params, controller)
          .addDirectory(
            { name: 'example-root2', label: 'my 2nd root', role: 'ROOT' },
            controller
          );
      }).to.throw(/INVALID_DIRECTORY_ROLE_ALREADY_DEFINED/);
    });

    it('should fail to add directory invalid controller', () => {
      controller.action = undefined;
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .addDirectory(params, controller);
      }).to.throw('INVALID_DIRECTORY_CONTROLLER of example-directory missing action function(s)');
      expect(validation.validateController).to.have.been.calledWith(controller, {
        requiredFunctions: ['getter', 'action'],
        handlerName: 'DIRECTORY',
        componentName: params.name,
      });
    });

    it('should fail to add a directory with an invalid role', () => {
      params.role = 'MyInvalidRole';
      expect(() =>
        generateDummyDevice({})
          .addDirectory(params, controller)
      ).to.throw(/INVALID_DIRECTORY_ROLE/);
    });
  });

  describe('addQueueDirectory', () => {
    it('should forward to addDirectory', () => {
      const expectedParams = { name: 'foo', label: 'bar', role: 'QUEUE' };
      const controller = { getter: () => new ListBuilder(), action: () => {} };
      const device = generateDummyDevice({});
      sandbox.stub(console, 'warn');
      sandbox.stub(device, 'addDirectory');

      device.addQueueDirectory({ name: 'foo', label: 'bar' }, controller);

      expect(device.addDirectory).to.have.been.calledWith(expectedParams, controller);
      // tslint:disable-next-line
      expect(console.warn).to.have.been.calledOnce;
    });
  });

  describe('addRootDirectory', () => {
    it('should forward to addDirectory', () => {
      const expectedParams = { name: 'foo', label: 'bar', role: 'ROOT' };
      const controller = { getter: () => new ListBuilder(), action: () => {} };
      const device = generateDummyDevice({});
      sandbox.stub(console, 'warn');
      sandbox.stub(device, 'addDirectory');

      device.addRootDirectory({ name: 'foo', label: 'bar' }, controller);

      expect(device.addDirectory).to.have.been.calledWith(expectedParams, controller);
      // tslint:disable-next-line
      expect(console.warn).to.have.been.calledOnce;
    });
  });

  describe('enableRegistration', () => {
    let device;
    let registrationController;
    let registrationParams;
    let sliderParams;
    const type = 'SECURITY_CODE';
    const headerText = 'header text';
    const description = 'some hints';

    beforeEach(() => {
      device = generateDummyDevice({});
      registrationController = {
        register: () => {},
        isRegistered: () => {},
      };
      registrationParams = [{ headerText, description, type }, registrationController];
      sliderParams = [
        { name: 'example-slider', label: 'my%20slider', range: [0, 200], unit: '@' },
        { setter: () => {}, getter: () => {} },
      ];
    });

    it('should reject device with invalid registration option', () => {
      expect(() => {
        device.enableRegistration(undefined, registrationController);
      }).to.throw(/INVALID_REGISTRATION/);
    });

    it('should catch controller missing register function', () => {
      registrationController.register = undefined;

      expect(() => {
        device.enableRegistration(...registrationParams);
      }).to.throw(/INVALID_REGISTRATION_CONTROLLER/);
      expect(validation.validateController).to.have.been.calledWith(registrationController, {
        requiredFunctions: ['register', 'isRegistered'],
        handlerName: 'REGISTRATION',
      });
    });

    it('should catch invalid type', () => {
      registrationParams[0].type = 'IP_ADDRESS';
      expect(() => {
        device.enableRegistration(...registrationParams);
      }).to.throw(/INVALID_REGISTRATION_TYPE: IP_ADDRESS/);
    });

    it('should catch missing header', () => {
      registrationParams[0].headerText = undefined;
      expect(() => {
        device.enableRegistration(...registrationParams);
      }).to.throw(/MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION/);
    });

    it('should catch missing description', () => {
      expect(() => {
        device.enableRegistration({ headerText, type }, registrationController);
      }).to.throw(/MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION/);
    });

    it('should reject device with multiple enableRegistration', () => {
      expect(() => {
        device
          .enableRegistration(...registrationParams)
          .enableRegistration(...registrationParams);
      }).to.throw(/REGISTERHANLDER_ALREADY_DEFINED/);
    });

    it('should build device with a slider and enabled registration - but misses the discovery step', () => {
      expect(() => {
        device
          .enableRegistration(...registrationParams)
          .addSlider(...sliderParams)
          .build();
      }).to.throw(/REGISTRATION_ENABLED_MISSING_DISCOVERY_STEP/);
    });

    it('should build device with an enabled registration and discovery', () => {
      device
        .enableRegistration(...registrationParams)
        .enableDiscovery({ headerText, description }, () => {})
        .addSlider(...sliderParams)
        .build();

      expect(device.deviceCapabilities).to.deep.equal([
        'register-user-account',
      ]);
      expect(device.setup).to.deep.equal({
        discovery: true,
        enableDynamicDeviceBuilder: false,
        introheader: 'header text',
        introtext: 'some hints',
        registration: true,
        registrationHeader: 'header text',
        registrationText: 'some hints',
        registrationType: 'SECURITY_CODE',
      });
    });
  });

  describe('addSlider', () => {
    let sliderOptions;
    let sliderController;

    beforeEach(() => {
      sliderOptions = { name: 'example-slider', label: 'my slider', range: [0, 200], unit: '@' };
      sliderController = { setter: () => {}, getter: () => 100 };
    });

    it('should reject device with duplicate names (button and slider)', () => {
      sliderOptions.name = 'example-button';
      expect(() => {
        generateDummyDevice({ addButton: true })
          .addSlider(sliderOptions, sliderController)
          .build();
      }).to.throw(/DUPLICATE_PATH_DETECTED/);
    });

    it('should reject invalid controller', () => {
      sliderController = undefined;
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .addSlider(sliderOptions, sliderController);
      }).to.throw(/INVALID_SLIDER_CONTROLLER of example-slider undefined/);
      expect(validation.validateController).to.have.been.calledWith(sliderController, {
        requiredFunctions: ['setter', 'getter'],
        handlerName: 'SLIDER',
        componentName: sliderOptions.name,
      });
    });

    it('should reject device with missing param.name', () => {
      sliderOptions.name = undefined;
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .addSlider(sliderOptions, sliderController);
      }).to.throw(/MISSING_ELEMENT_NAME/);
    });

    it('should build device with a slider', () => {
      const device = generateDummyDevice({ type: 'light' })
        .addSlider(sliderOptions, sliderController)
        .build();

      expect(device.capabilities).to.deep.equal([{
        type: 'sensor',
        name: 'EXAMPLE-SLIDER_SENSOR',
        label: 'my%20slider',
        path: '/device/' + DUMMY_ADAPTER_NAME + '/EXAMPLE-SLIDER_SENSOR',
        sensor: {
          type: 'range',
          range: [0, 200],
          unit: '%40',
        },
      },
      {
        type: 'slider',
        name: 'example-slider',
        label: 'my%20slider',
        path: '/device/' + DUMMY_ADAPTER_NAME + '/example-slider',
        slider: {
          type: 'range',
          sensor: 'EXAMPLE-SLIDER_SENSOR',
          range: [0, 200],
          unit: '%40',
        },
      }]);
    });
  });

  describe('defineTiming', () => {
    it('should report if device supports timing - false', () => {
      const device = generateDummyDevice({ type: 'ACCESSOIRE' });
      expect(device.supportsTiming()).to.equal(false);
    });

    it('should report if device supports timing - true', () => {
      const device = generateDummyDevice({ type: 'GAMECONSOLE' });
      expect(device.supportsTiming()).to.equal(true);
    });

    it('should reject device when devicetype does not support timing', () => {
      expect(() => {
        generateDummyDevice({ type: 'LIGHT' })
          .defineTiming({ powerOnDelayMs: 500 })
          .build();
      }).to.throw(/TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT/);
    });

    it('should build device with full timing', () => {
      const powerOnDelayMs = 1111;
      const sourceSwitchDelayMs = 2222;
      const shutdownDelayMs = 3333;
      const device = generateDummyDevice({ addLabel: true, type: 'VOD' })
        .defineTiming({ powerOnDelayMs, sourceSwitchDelayMs, shutdownDelayMs })
        .build();
      expect(validation.validateTiming).to.have.been.calledOnce;
      expect(device.timing!.standbyCommandDelay).to.equal(powerOnDelayMs);
      expect(device.timing!.sourceSwitchDelay).to.equal(sourceSwitchDelayMs);
      expect(device.timing!.shutdownDelay).to.equal(shutdownDelayMs);
    });

    it('should build device with partial timing', () => {
      const device = generateDummyDevice({ addLabel: true, type: 'VOD' })
        .defineTiming({ powerOnDelayMs: 1500 })
        .build();
      expect(validation.validateTiming).to.have.been.calledOnce;
      expect(device.timing!.standbyCommandDelay).to.equal(1500);
      expect(device.timing!.sourceSwitchDelay).to.equal(undefined);
      expect(device.timing!.shutdownDelay).to.equal(undefined);
    });
  });

  it('should reject device with multiple power state definitions', () => {
    expect(() => {
      generateDummyDevice({})
        .addPowerStateSensor({ getter: () => true })
        .addPowerStateSensor({ getter: () => true })
        .build();
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should generic consistent adapterName', () => {
    const device1 = generateDummyDevice({ addButton: true }).build();
    const device2 = generateDummyDevice({ addButton: true }).build();
    expect(device1.adapterName).to.deep.equal(device2.adapterName);
  });

  it('should build device with a custom icon', () => {
    const device = generateDummyDevice({ addButton: true })
      .setIcon('sonos')
      .build();

    expect(device).to.have.nested.property('devices[0].icon', 'sonos');
  });

  it('should build device with a specific device name', () => {
    const device = generateDummyDevice({ addButton: true })
      .setSpecificName('VERY SPECIFIC')
      .build();

    expect(device).to.have.nested.property('devices[0].specificname', 'VERY SPECIFIC');
  });

  it('should build device with a version number', () => {
    const device = generateDummyDevice({ addButton: true })
      .setDriverVersion(4)
      .setIcon('sonos')
      .build();

    expect(device).to.have.property('driverVersion', 4);
  });

  describe('registerSubscriptionFunction', () => {
    it('should build device with a subscriptionFunction', () => {
      function callback() {}

      const device = generateDummyDevice({ addLabel: true })
        .registerSubscriptionFunction(callback)
        .build();

      expect(device.subscriptionFunction).to.deep.equal(callback);
    });

    it('should reject device with multiple registerSubscriptionFunction', () => {
      expect(() => {
        generateDummyDevice({})
          .registerSubscriptionFunction(() => {})
          .registerSubscriptionFunction(() => {});
      }).to.throw(/SUBSCRIPTIONHANDLER_ALREADY_DEFINED/);
    });

    it('should build device with a subscriptionFunction', () => {
      const registerCallback = 42;
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .registerSubscriptionFunction(registerCallback);
      }).to.throw(/INVALID_CONTROLLER_FUNCTION_SUBSCRIPTIONHANDLER/);
    });
  });

  describe('registerInitialiseFunction', () => {
    it('should build device with an initialiseFunction', () => {
      function callback() {}
      const device = generateDummyDevice({ addLabel: true })
        .registerInitialiseFunction(callback)
        .build();

      expect(device.initialiseFunction).to.equal(callback);
    });

    it('should reject device with multiple initialiseFunctions', () => {
      expect(() => {
        generateDummyDevice({})
          .registerInitialiseFunction(() => {})
          .registerInitialiseFunction(() => {});
      }).to.throw(/INITIALISATIONHANDLER_ALREADY_DEFINED/);
    });

    it('should reject device non function initialiseFunction', () => {
      const registerCallback = 42;
      expect(() => {
        generateDummyDevice({})
          // @ts-ignore
          .registerInitialiseFunction(registerCallback);
      }).to.throw(/INVALID_CONTROLLER_FUNCTION_INITIALISATIONHANDLER/);
    });
  });

  describe('registerDeviceSubscriptionHandler', () => {
    let device;
    const deviceAdded = () => {};
    const deviceRemoved = () => {};
    const initializeDeviceList = () => {};

    beforeEach(() => {
      device = generateDummyDevice({ addLabel: true });
    });

    it('should reject multiple handlers', () => {
      const handler = { deviceAdded, deviceRemoved, initializeDeviceList };

      expect(() => {
        device
          .registerDeviceSubscriptionHandler(handler)
          .registerDeviceSubscriptionHandler(handler);
      }).to.throw(/DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED/);
    });

    it('should validated controller', () => {
      expect(() => {
        device.registerDeviceSubscriptionHandler();

        expect(validation.validateController).to.have.been.calledWith(undefined, {
          requiredFunctions: ['deviceAdded', 'deviceRemoved', 'initializeDeviceList'],
          handlerName: 'DEVICESUBSCRIPTION',
        });
      }).to.throw(/INVALID_DEVICESUBSCRIPTION_CONTROLLER undefined/);
    });

    it('should build device with a subscriptionFunction', () => {
      const handler = { deviceAdded, deviceRemoved, initializeDeviceList };

      device.registerDeviceSubscriptionHandler(handler).build('foo');

      expect(device.deviceSubscriptionHandlers).to.deep.equal(handler);
    });
  });

  describe('registerFavoriteHandlers', () => {
    let device;
    let handler;
    const execute = () => {};

    beforeEach(() => {
      device = generateDummyDevice({ addLabel: true });
      handler = { execute };
    });

    it('should reject multiple handlers', () => {
      expect(() => {
        device
          .registerFavoriteHandlers(handler)
          .registerFavoriteHandlers(handler);
      }).to.throw(/FAVORITE_HANDLERS_ALREADY_DEFINED/);
    });

    it('should validate handler', () => {
      expect(() => {
        device.registerFavoriteHandlers();
      }).to.throw(/INVALID_FAVORITE_CONTROLLER undefined/);
      expect(validation.validateController).to.have.been.calledWith(undefined, {
        requiredFunctions: ['execute'],
        handlerName: 'FAVORITE',
      });
    });

    it('should fail to build for unsupported device type', () => {
      device.setType('GAMECONSOLE')
        .registerFavoriteHandlers(handler);
      expectFailToBuildWith(device, /FAVORITES_HANDLER_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT/);
    });

    it('should build device with a subscriptionFunction', () => {
      device.setType('DVB')
        .registerFavoriteHandlers(handler)
        .build();

      expect(device.deviceCapabilities).to.include('customFavoriteHandler');
      expect(device.favoritesHandler).to.deep.equal(handler);
    });
  });

  it('should build device, use button group', () => {
    const device = generateDummyDevice({})
      .addButtonGroup('volume')
      .addButtonHandler(() => {})
      .build();
    expect(device.capabilities.length).to.equal(3);
  });

  describe('addCapability', () => {
    it('should build device with alwayOn capability', () => {
      const device = generateDummyDevice({ addLabel: true })
        .addCapability('alwaysOn')
        .build();
      expect(device.deviceCapabilities).to.deep.equal(['alwaysOn']);
    });

    it('should fail to build a device with an invalid capability', () => {
      expect(() => {
        generateDummyDevice({ addLabel: true })
          // @ts-ignore
          .addCapability('invalid');
      }).to.throw(/INVALID_CAPABILITY/);
    });
  });

  it('should build device with powerstate sensor', () => {
    const controller = { getter: () => true };
    const device = generateDummyDevice({})
      .addPowerStateSensor(controller)
      .build();

    expect(validation.validateController).to.have.been.calledWith(controller, {
      requiredFunctions: ['getter'],
      handlerName: 'POWERSENSOR',
    });
    expect(device.capabilities.length).to.equal(1);
    const powerstateCapability = device.capabilities[0] as any;
    expect(powerstateCapability.label).to.equal('Powerstate');
    expect(powerstateCapability.name).to.equal('powerstate');
    expect(powerstateCapability.sensor.type).to.equal('power');
  });

  it('should build device with a switch', () => {
    const controller = { setter: () => {}, getter: () => true };
    const device = generateDummyDevice({})
      .addSwitch(
        { name: 'example-switch', label: 'my switch' },
        controller
      )
      .build();

    expect(validation.validateController).to.have.been.calledWith(controller, {
      requiredFunctions: ['setter', 'getter'],
      handlerName: 'SWITCH',
      componentName: 'example-switch',
    });
    expect(device.capabilities).to.deep.equal([
      {
        type: 'sensor',
        name: 'EXAMPLE-SWITCH_SENSOR',
        label: 'my%20switch',
        path: '/device/' + DUMMY_ADAPTER_NAME + '/EXAMPLE-SWITCH_SENSOR',
        sensor: { type: 'binary' },
      },
      {
        type: 'switch',
        name: 'example-switch',
        label: 'my%20switch',
        path: '/device/' + DUMMY_ADAPTER_NAME + '/example-switch',
        sensor: 'EXAMPLE-SWITCH_SENSOR',
      },
    ]);
  });

  describe('addPlayerWidget', () => {
    let device;
    let handler;

    beforeEach(() => {
      handler = {
        rootDirectory: {
          name: 'PLAYER_ROOT',
          label: 'My library',
          controller: { getter: () => new ListBuilder(), action: () => {} },
        },
        queueDirectory: {
          name: 'PLAYER_QUEUE',
          label: 'Playlist',
          controller: { getter: () => new ListBuilder(), action: () => {} },
        },
        volumeController: { setter: () => {}, getter: () => 0 },
        coverArtController: { getter: () => '' },
        titleController: { getter: () => '' },
        descriptionController: { getter: () => '' },
        playingController: { setter: () => {}, getter: () => true },
        muteController: { setter: () => {}, getter: () => true },
        shuffleController: { setter: () => {}, getter: () => true },
        repeatController: { setter: () => {}, getter: () => true },
      };
      device = generateDummyDevice({ addButton: true, type: 'MUSICPLAYER' });
      sandbox.spy(device, 'addButton');
      sandbox.spy(device, 'addDirectory');
      sandbox.spy(device, 'addSlider');
      sandbox.spy(device, 'addSwitch');
      sandbox.spy(device, 'addSensor');
    });

    it('should reject unsupported types on build', () => {
      expectFailToBuildWith(device
        .setType('GAMECONSOLE')
        .addPlayerWidget(handler), /INVALID_DEVICE_TYPE_FOR_PLAYER_WIDGET_GAMECONSOLE/);
    });

    it('should validate handler', () => {
      device.addPlayerWidget(handler);
      expect(validation.validatePlayerWidget).to.have.been.calledOnce;
    });

    it('should reject multiple player widgets', () => {
      expect(() => {
        device.addPlayerWidget(handler)
          .addPlayerWidget(handler);
      }).to.throw(/PLAYER_WIDGET_ALREADY_DEFINED/);
    });

    it('should add all components', () => {
      device.addPlayerWidget(handler);

      expect(device.addDirectory).to.have.been.calledWith({
        name: handler.rootDirectory.name,
        label: handler.rootDirectory.label,
        role: 'ROOT',
      }, handler.rootDirectory.controller);
      expect(device.addDirectory).to.have.been.calledWith({
        name: handler.queueDirectory.name,
        label: handler.queueDirectory.label,
        role: 'QUEUE',
      }, handler.queueDirectory.controller);
      expect(device.addSlider).to.have.been.calledWith(
        PlayerWidget.playerVolumeDefinition,
        handler.volumeController
      );
      expect(device.addSensor).to.have.been.calledWith(
        PlayerWidget.coverArtDefinition,
        handler.coverArtController
      );
      expect(device.addSensor).to.have.been.calledWith(
        PlayerWidget.titleDefinition,
        handler.titleController
      );
      expect(device.addSensor).to.have.been.calledWith(
        PlayerWidget.descriptionDefinition,
        handler.descriptionController
      );
      expect(device.addSwitch).to.have.been.calledWith(
        PlayerWidget.playingDefinition,
        handler.playingController
      );
      expect(device.addSwitch).to.have.been.calledWith(
        PlayerWidget.muteDefinition,
        handler.muteController
      );
      expect(device.addSwitch).to.have.been.calledWith(
        PlayerWidget.shuffleDefinition,
        handler.shuffleController
      );
      expect(device.addSwitch).to.have.been.calledWith(
        PlayerWidget.repeatDefinition,
        handler.repeatController
      );
    });

    it('should set default name/label for directories if missing', () => {
      handler.rootDirectory = { controller: handler.rootDirectory.controller };
      handler.queueDirectory = { controller: handler.queueDirectory.controller };
      device.addPlayerWidget(handler);

      expect(device.addDirectory).to.have.been.calledWith(
        { name: 'ROOT_DIRECTORY', label: 'ROOT', role: 'ROOT' },
        handler.rootDirectory.controller
      );
      expect(device.addDirectory).to.have.been.calledWith(
        { name: 'QUEUE_DIRECTORY', label: 'QUEUE', role: 'QUEUE' },
        handler.queueDirectory.controller
      );
    });

    it('should build root only if no queue', () => {
      handler.queueDirectory = undefined;
      device.addPlayerWidget(handler);

      expect(device.addDirectory).to.have.been.calledOnce;
    });

    it('should add all required buttons', () => {
      device.addPlayerWidget(handler);

      PlayerWidget.playerButtonNames.forEach((name) => {
        expect(device.addButton).to.have.been.calledWith({ name });
      });
    });
  });

  function expectFailToBuildWith(device, expectedError) {
    expect(() => {
      device.build();
    }).to.throw(expectedError);
  }

  function generateDummyDevice(options) {
    const { addLabel, addButton, type } = options;
    const device = new DeviceBuilder('example-adapter', 'unitTest')
      .setManufacturer('NEEO');
    if (type) {
      device.setType(type);
    }
    if (addLabel) {
      device.addTextLabel({ name: 'name', label: 'label' }, () => 'test');
    }
    if (addButton) {
      device.addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(() => {});
    }
    return device;
  }
});
