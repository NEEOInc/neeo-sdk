// tslint:disable:max-line-length

import { expect } from 'chai';
import { DeviceBuilder } from '../../../../src/lib/device/deviceBuilder';
import ListBuilder from '../../../../src/lib/device/lists/listBuilder';

describe('./lib/device/deviceBuilder.ts', () => {
  it('should fail to create device, no capabilities', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .build();
    }).to.throw(/INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES/);
  });

  it('should not fail to create device without capabilities when enableDynamicDeviceBuilder is set', () => {
    const discoverSetting = {
      description: 'foo',
      headerText: 'bar',
      enableDynamicDeviceBuilder: true,
    };
    const result = new DeviceBuilder('example-adapter')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .enableDiscovery(discoverSetting, () => [])
      .build();
    expect(result.setup.enableDynamicDeviceBuilder).to.equal(true);
  });

  it('should fail to create device if enableDynamicDeviceBuilder is set and additional capabilities are defined', () => {
    const discoverSetting = {
      description: 'foo',
      headerText: 'bar',
      enableDynamicDeviceBuilder: true,
    };
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .enableDiscovery(discoverSetting, () => [])
        .addButton({ name: 'example-button', label: 'my%20button' })
        .addButtonHandler(() => {})
        .build();
    }).to.throw(
      /DYNAMICDEVICEBUILDER_ENABLED_DEVICES_MUST_NOT_HAVE_CAPABILITIES_DEFINED/
    );
  });

  it('should fail to create device, invalid devicetype', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('foo')
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .build();
    }).to.throw(/INVALID_DEVICETYPE/);
  });

  it('should fail to create device, name too long', () => {
    expect(() => {
      new DeviceBuilder(
        'example-adapter-disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf'
      )
        .setManufacturer('NEEO')
        .build();
    }).to.throw(/DEVICENNAME_TOO_LONG/);
  });

  it('should fail to create device, invalid specific name', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setSpecificName(
          'example-adapter-disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf'
        )
        .build();
    }).to.throw(/SPECIFIC_NAME_TOO_LONG/);
  });

  it('should fail to create device, invalid capability name (button)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({
          name:
            'example-button-disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf',
          label: 'my%20button',
        })
        .addButtonHandler(() => {})
        .build();
    }).to.throw(
      /NAME_TOO_LONG_example-button-disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf/
    );
  });

  it('should fail to create device, invalid capability label (button)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({
          name: 'example-button',
          label:
            'my button disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf',
        })
        .addButtonHandler(() => {})
        .build();
    }).to.throw(
      /LABEL_TOO_LONG_my button disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf/
    );
  });

  it('should fail to create device, invalid capability name (textlabel)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel(
          {
            name:
              'labelname disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf',
            label: 'label',
          },
          () => 'label'
        )
        .build();
    }).to.throw(
      /NAME_TOO_LONG_labelname disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf/
    );
  });

  it('should fail to create device, invalid capability label (textlabel)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel(
          {
            name: 'labelname',
            label:
              'label disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf',
          },
          () => 'label'
        )
        .build();
    }).to.throw(
      /LABEL_TOO_LONG_label disubfiubdsfbisudfbsduifbsdiufbsdiufbsdiufbisdubfisdubfisudbisdubf/
    );
  });

  it('should fail to create directory, invalid missing name', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        // @ts-ignore
        .addDirectory({}, { getter: () => {}, action: () => {} })
        .build('foo');
    }).to.throw(/MISSING_ELEMENT_NAME/);
  });

  it('should fail to create directory, missing label', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        // @ts-ignore
        .addDirectory({ name: 'foo' }, { getter: () => {}, action: () => {} })
        .build();
    }).to.throw(/MISSING_DIRECTORY_LABEL/);
  });

  it('should fail to create directory, invalid label', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addDirectory(
          {
            name: 'foo',
            label:
              'erbfeirufbuierbfeirubfierubfiuerbfiuerbfiuerbfiuerbfiuerbfiuerbfieurbfiuerbfiuerbfbeirubfi',
          },
          {
            getter: () => new ListBuilder(),
            action: () => {},
          }
        )
        .build();
    }).to.throw(
      /DIRECTORY_LABEL_TOO_LONG_erbfeirufbuierbfeirubfierubfiuerbfiuerbfiuerbfiuerbfiuerbfiuerbfieurbfiuerbfiuerbfbeirubfi/
    );
  });

  it('should fail to create device, missing button controller', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'run-one', label: 'button one' })
        .addButton({ name: 'run-two', label: 'button two' })
        .build();
    }).to.throw(/BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED/);
  });

  it('should fail to create device, duplicate names (button)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(() => {})
        .build();
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should fail to create device, multiple buttonhandler', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(() => {})
        .addButtonHandler(() => {});
    }).to.throw(/BUTTONHANDLER_ALREADY_DEFINED/);
  });

  it('should fail to create device, invalid enableDiscovery', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .enableDiscovery({ headerText: '', description: '' }, () => [
          {
            id: '',
            name: '',
          },
        ]);
    }).to.throw(/INVALID_DISCOVERY_PARAMETER/);
  });

  it('should fail to create device, multiple enableDiscovery', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .enableDiscovery({ headerText: 'x', description: 'x' }, () => [
          {
            id: '',
            name: '',
          },
        ])
        .enableDiscovery({ headerText: 'x', description: 'x' }, () => [
          {
            id: '',
            name: '',
          },
        ]);
    }).to.throw(/DISCOVERHANDLER_ALREADY_DEFINED/);
  });

  describe('enableRegistration', () => {
    let device;
    let registrationController;
    const type = 'SECURITY_CODE';
    const headerText = 'header text';
    const description = 'some hints';

    beforeEach(() => {
      device = new DeviceBuilder('example-adapter', 'unitTest').setManufacturer(
        'NEEO'
      );

      registrationController = {
        register: () => {},
        isRegistered: () => {},
      };
    });

    it('should fail to create device, invalid registration option', () => {
      expect(() => {
        device.enableRegistration(undefined, registrationController);
      }).to.throw(/INVALID_REGISTRATION/);
    });

    it('should catch invalid controller', () => {
      expect(() => {
        device.enableRegistration(
          { headerText, description, type },
          'notAFunction'
        );
      }).to.throw(/INVALID_REGISTRATION_CONTROLLER/);
    });

    it('should catch controller missing register function', () => {
      // GIVEN
      registrationController.register = undefined;

      expect(() => {
        device.enableRegistration(
          { headerText, description, type },
          registrationController
        );
      }).to.throw(/INVALID_REGISTRATION_CONTROLLER/);
    });

    it('should catch controller missing isRegistered function', () => {
      // GIVEN
      registrationController.isRegistered = undefined;

      expect(() => {
        device.enableRegistration(
          { headerText, description, type },
          registrationController
        );
      }).to.throw(/INVALID_REGISTRATION_CONTROLLER/);
    });

    it('should catch invalid type', () => {
      expect(() => {
        device.enableRegistration(
          { headerText, description, type: 'IP_ADDRESS' },
          registrationController
        );
      }).to.throw(/INVALID_REGISTRATION_TYPE: IP_ADDRESS/);
    });

    it('should catch missing header', () => {
      expect(() => {
        device.enableRegistration(
          { description, type },
          registrationController
        );
      }).to.throw(/MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION/);
    });

    it('should catch missing description', () => {
      expect(() => {
        device.enableRegistration({ headerText, type }, registrationController);
      }).to.throw(/MISSING_REGISTRATION_HEADERTEXT_OR_DESCRIPTION/);
    });

    it('should fail to create device, multiple enableRegistration', () => {
      expect(() => {
        device
          .enableRegistration(
            { headerText, description, type },
            registrationController
          )
          .enableRegistration(
            { headerText, description, type },
            registrationController
          );
      }).to.throw(/REGISTERHANLDER_ALREADY_DEFINED/);
    });

    it('should build device with a slider and enabled registration - but misses the discovery step', () => {
      expect(() => {
        device
          .setType('light')
          .enableRegistration(
            { headerText, description, type },
            registrationController
          )
          .addSlider(
            {
              name: 'example-slider',
              label: 'my%20slider',
              range: [0, 200],
              unit: '@',
            },
            { setter: () => {}, getter: () => {} }
          )
          .build('foo');
      }).to.throw(/REGISTRATION_ENABLED_MISSING_DISCOVERY_STEP/);
    });

    it('should build device with an enabled registration and discovery', () => {
      device
        .setType('light')
        .enableRegistration(
          { headerText, description, type },
          registrationController
        )
        .enableDiscovery({ headerText, description }, () => {})
        .addSlider(
          {
            name: 'example-slider',
            label: 'my%20slider',
            range: [0, 200],
            unit: '@',
          },
          { setter: () => {}, getter: () => {} }
        )
        .build('foo');

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

  it('should fail to create device, controller is not a function', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my%20button' })
        // @ts-ignore
        .addButtonHandler(1)
        .build('foo');
    }).to.throw(/MISSING_BUTTONHANDLER_CONTROLLER_PARAMETER/);
  });

  it('should fail to create device, duplicate names (button and slider)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-foo', label: 'my button' })
        .addButtonHandler(() => {})
        .addSlider(
          {
            name: 'example-foo',
            label: 'my slider',
            range: [0, 200],
            unit: '@',
          },
          { setter: () => {}, getter: () => 100 }
        )
        .build();
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should fail to create device, missing param.name', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addSlider(
          // @ts-ignore
          { label: 'my slider', range: [0, 200], unit: '@' },
          { setter: () => {}, getter: () => {} }
        )
        .build('foo');
    }).to.throw(/MISSING_ELEMENT_NAME/);
  });

  it('should fail to create device, invalid timing parameter', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({})
        .build();
    }).to.throw(/INVALID_TIMING_PARAMETER/);
  });

  it('should fail to create device, devicetype does not support timing', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('LIGHT')
        .defineTiming({ powerOnDelayMs: 500 })
        .build();
    }).to.throw(/TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT/);
  });

  it('should fail to create device, invalid timing data (string)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        // @ts-ignore
        .defineTiming({ powerOnDelayMs: 'lala' })
        .build('foo');
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, invalid timing data (negative)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({ powerOnDelayMs: -55 })
        .build();
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, invalid timing data (too large)', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({ powerOnDelayMs: 999999999 })
        .build();
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, multiple power state definitions', () => {
    expect(() => {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addPowerStateSensor({ getter: () => true })
        .addPowerStateSensor({ getter: () => true })
        .build();
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should build device defined adapter names', () => {
    const Device1 = new DeviceBuilder('example-adapter', 'XXX');
    const device1 = Device1.addButton({
      name: 'example-button',
      label: 'my button',
    })
      .addButtonHandler(() => {})
      .build();
    const Device2 = new DeviceBuilder('example-adapter', 'XXX');
    const device2 = Device2.addButton({
      name: 'example-button',
      label: 'my button',
    })
      .addButtonHandler(() => {})
      .build();
    expect(device1.adapterName).to.deep.equal(device2.adapterName);
  });

  it('should build device with a button', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('light')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(() => {})
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'LIGHT',
      initialiseFunction: undefined,
      manufacturer: 'NEEO',
      driverVersion: undefined,
      setup: {},
      timing: undefined,
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          specificname: undefined,
          icon: undefined,
          tokens: ['foo', 'bar'],
        },
      ],
      capabilities: [
        {
          type: 'button',
          name: 'example-button',
          label: 'my%20button',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button',
        },
      ],
    });
  });

  it('should build device with a button and a custom device icon', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('mediaplayer')
      .setIcon('sonos')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(() => {})
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'MEDIAPLAYER',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      setup: {},
      timing: undefined,
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          specificname: undefined,
          tokens: ['foo', 'bar'],
          icon: 'sonos',
        },
      ],
      capabilities: [
        {
          type: 'button',
          name: 'example-button',
          label: 'my%20button',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button',
        },
      ],
    });
  });

  it('should build device with a button and a custom specific device name', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('mediaplayer')
      .setIcon('sonos')
      .setSpecificName('VERY SPECIFIC')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(() => {})
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'MEDIAPLAYER',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      setup: {},
      timing: undefined,
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          tokens: ['foo', 'bar'],
          icon: 'sonos',
          specificname: 'VERY SPECIFIC',
        },
      ],
      capabilities: [
        {
          type: 'button',
          name: 'example-button',
          label: 'my%20button',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button',
        },
      ],
    });
  });

  it('should build device with a version number', () => {
    const device = new DeviceBuilder('versioned-device', 'XXX')
      .setManufacturer('NEEO')
      .setDriverVersion(4)
      .setType('mediaplayer')
      .setIcon('sonos')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(() => {})
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-f3ac2048f3f7caa42e83b0b3f551b2750630f8fc',
      apiversion: '1.0',
      type: 'MEDIAPLAYER',
      manufacturer: 'NEEO',
      driverVersion: 4,
      initialiseFunction: undefined,
      timing: undefined,
      setup: {},
      deviceCapabilities: [],
      devices: [
        {
          name: 'versioned-device',
          specificname: undefined,
          tokens: [],
          icon: 'sonos',
        },
      ],
      capabilities: [
        {
          type: 'button',
          name: 'example-button',
          label: 'my%20button',
          path:
            '/device/apt-f3ac2048f3f7caa42e83b0b3f551b2750630f8fc/example-button',
        },
      ],
    });
  });

  describe('registerSubscriptionFunction', () => {
    it('should build device with a subscriptionFunction', () => {
      // GIVEN
      function callback() {}

      // WHEN
      const device = new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel({ name: 'name', label: 'label' }, () => 'test')
        .registerSubscriptionFunction(callback)
        .build();

      // THEN
      expect(device.subscriptionFunction).to.deep.equal(callback);
    });

    it('should fail to create device, multiple registerSubscriptionFunction', () => {
      expect(() => {
        new DeviceBuilder('example-adapter')
          .setManufacturer('NEEO')
          .registerSubscriptionFunction(() => {})
          .registerSubscriptionFunction(() => {});
      }).to.throw(/SUBSCRIPTIONHANDLER_ALREADY_DEFINED/);
    });

    it('should build device with a subscriptionFunction', () => {
      // GIVEN
      const registerCallback = 42;

      // WHEN/THEN
      expect(() => {
        new DeviceBuilder('example-adapter', 'XXX')
          .setManufacturer('NEEO')

          // @ts-ignore
          .registerSubscriptionFunction(registerCallback);
      }).to.throw(/INVALID_SUBSCRIPTIONHANDLER_FUNCTION/);
    });
  });

  describe('registerInitialiseFunction', () => {
    it('should build device with an initialiseFunction', () => {
      // GIVEN
      function callback() {}

      // WHEN
      const device = new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel({ name: 'name', label: 'label' }, () => 'test')
        .registerInitialiseFunction(callback)
        .build();

      // THEN
      expect(device.initialiseFunction).to.deep.equal(callback);
    });

    it('should fail to create device, multiple initialiseFunctions', () => {
      expect(() => {
        new DeviceBuilder('example-adapter')
          .setManufacturer('NEEO')
          .registerInitialiseFunction(() => {})
          .registerInitialiseFunction(() => {});
      }).to.throw(/INITIALISATION_FUNCTION_ALREADY_DEFINED/);
    });

    it('should build device with a initialiseFunction', () => {
      // GIVEN
      const registerCallback = 42;

      // WHEN/THEN
      expect(() => {
        new DeviceBuilder('example-adapter', 'XXX')
          .setManufacturer('NEEO')
          // @ts-ignore
          .registerInitialiseFunction(registerCallback);
      }).to.throw(/INVALID_INITIALISATION_FUNCTION/);
    });
  });

  describe('registerDeviceSubscriptionHandler', () => {
    let device;
    const deviceAdded = () => {};
    const deviceRemoved = () => {};
    const initializeDeviceList = () => {};

    beforeEach(() => {
      device = new DeviceBuilder('example-adapter', 'unitTest')
        .setManufacturer('NEEO')
        .addTextLabel({ name: 'name', label: 'label' }, () => 'test');
    });

    it('should reject multiple handlers', () => {
      // GIVEN
      const handler = { deviceAdded, deviceRemoved, initializeDeviceList };

      // WHEN
      expect(() => {
        device
          .registerDeviceSubscriptionHandler(handler)
          .registerDeviceSubscriptionHandler(handler);
      }).to.throw(/DEVICESUBSCRIPTIONHANDLERS_ALREADY_DEFINED/);
    });

    it('should reject undefined handler', () => {
      // WHEN
      expect(() => {
        device.registerDeviceSubscriptionHandler();
      }).to.throw(/INVALID_SUBSCRIPTION_CONTROLLER_UNDEFINED/);
    });

    it('should reject handlers missing deviceAdded', () => {
      // GIVEN
      const handler = { deviceRemoved, initializeDeviceList };

      // WHEN
      expect(() => {
        device.registerDeviceSubscriptionHandler(handler);
      }).to.throw(/INVALID_SUBSCRIPTION_CONTROLLER missing/);
    });

    it('should reject handlers missing deviceRemoved', () => {
      // GIVEN
      const handler = { deviceAdded, initializeDeviceList };

      // WHEN
      expect(() => {
        device.registerDeviceSubscriptionHandler(handler);
      }).to.throw(/INVALID_SUBSCRIPTION_CONTROLLER missing/);
    });

    it('should reject handlers missing initializeDeviceList', () => {
      // GIVEN
      const handler = { deviceAdded, deviceRemoved };

      // WHEN
      expect(() => {
        device.registerDeviceSubscriptionHandler(handler);
      }).to.throw(/INVALID_SUBSCRIPTION_CONTROLLER missing/);
    });

    it('should build device with a subscriptionFunction', () => {
      // GIVEN
      const handler = { deviceAdded, deviceRemoved, initializeDeviceList };

      // WHEN
      device.registerDeviceSubscriptionHandler(handler).build('foo');

      // THEN
      expect(device.deviceSubscriptionHandlers).to.deep.equal(handler);
    });
  });

  it('should build device, use button group', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addButtonGroup('volume')
      .addButtonHandler(() => {})
      .build();
    expect(device.capabilities.length).to.equal(3);
  });

  it('should build device with a text label', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => 'test')
      .build();

    const handler = device.handler.get('LABELNAME_SENSOR');
    expect(typeof handler!.controller.getter).to.equal('function');

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      setup: {},
      driverVersion: undefined,
      timing: undefined,
      initialiseFunction: undefined,
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          specificname: undefined,
          icon: undefined,
          tokens: [],
        },
      ],
      capabilities: [
        {
          type: 'sensor',
          name: 'LABELNAME_SENSOR',
          label: 'label',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/LABELNAME_SENSOR',
          sensor: {
            type: 'string',
          },
        },
        {
          type: 'textlabel',
          name: 'labelname',
          label: 'label',
          isLabelVisible: undefined,
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/labelname',
          sensor: 'LABELNAME_SENSOR',
        },
      ],
    });
  });

  it('should build a device with a text label when isLabelVisible is set to false', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel(
        { name: 'labelname', label: 'label', isLabelVisible: false },
        () => 'label'
      )
      .build();

    const handler = device.handler.get('LABELNAME_SENSOR');
    expect(typeof handler!.controller.getter).to.equal('function');

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      timing: undefined,
      setup: {},
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          specificname: undefined,
          icon: undefined,
          tokens: [],
        },
      ],
      capabilities: [
        {
          type: 'sensor',
          name: 'LABELNAME_SENSOR',
          label: 'label',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/LABELNAME_SENSOR',
          sensor: {
            type: 'string',
          },
        },
        {
          type: 'textlabel',
          name: 'labelname',
          label: 'label',
          isLabelVisible: false,
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/labelname',
          sensor: 'LABELNAME_SENSOR',
        },
      ],
    });
  });

  it('should build device with a slider and enabled discovery', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .setType('light')
      .enableDiscovery(
        { headerText: 'header text', description: 'some hints' },
        () => [{ id: '', name: '' }]
      )
      .addSlider(
        {
          name: 'example-slider',
          label: 'my slider',
          range: [0, 200],
          unit: '@',
        },
        { setter: () => {}, getter: () => 100 }
      )
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'LIGHT',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      timing: undefined,
      setup: {
        discovery: true,
        enableDynamicDeviceBuilder: false,
        introheader: 'header text',
        introtext: 'some hints',
      },
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          icon: undefined,
          specificname: undefined,
          tokens: [],
        },
      ],
      capabilities: [
        {
          type: 'sensor',
          name: 'EXAMPLE-SLIDER_SENSOR',
          label: 'my%20slider',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/EXAMPLE-SLIDER_SENSOR',
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
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-slider',
          slider: {
            type: 'range',
            sensor: 'EXAMPLE-SLIDER_SENSOR',
            range: [0, 200],
            unit: '%40',
          },
        },
      ],
    });
  });

  it('should build device with a initialise function', () => {
    const initFunction = () => {};
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .registerInitialiseFunction(initFunction)
      .build();
    expect(device.initialiseFunction).to.equal(initFunction);
  });

  it('should build device with full timing', () => {
    const powerOnDelayMs = 1111;
    const sourceSwitchDelayMs = 2222;
    const shutdownDelayMs = 3333;
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .setType('VOD')
      .defineTiming({
        powerOnDelayMs,
        sourceSwitchDelayMs,
        shutdownDelayMs,
      })
      .build();
    expect(device.timing!.standbyCommandDelay).to.equal(powerOnDelayMs);
    expect(device.timing!.sourceSwitchDelay).to.equal(sourceSwitchDelayMs);
    expect(device.timing!.shutdownDelay).to.equal(shutdownDelayMs);
  });

  it('should build device with partial timing', () => {
    const powerOnDelayMs = 1111;
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .setType('VOD')
      .defineTiming({
        powerOnDelayMs,
      })
      .build();
    expect(device.timing!.standbyCommandDelay).to.equal(powerOnDelayMs);
    expect(device.timing!.sourceSwitchDelay).to.equal(undefined);
    expect(device.timing!.shutdownDelay).to.equal(undefined);
  });

  it('should build device with alwayOn capability', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .setType('VOD')
      .addCapability('alwaysOn')
      .build();
    expect(device.deviceCapabilities).to.deep.equal(['alwaysOn']);
  });

  it('should fail to build a device with an invalid capability', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
        .setType('LIGHT')
        .addCapability('invalid');
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should build device with powerstate sensor', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addPowerStateSensor({ getter: () => true })
      .build();

    expect(device.capabilities.length).to.equal(1);
    const powerstateCapability = device.capabilities[0] as any;
    expect(powerstateCapability.label).to.equal('Powerstate');
    expect(powerstateCapability.name).to.equal('powerstate');
    expect(powerstateCapability.sensor.type).to.equal('power');
  });

  it('should build device with a switch', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addSwitch(
        { name: 'example-switch', label: 'my switch' },
        { setter: () => {}, getter: () => true }
      )
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      timing: undefined,
      setup: {},
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          icon: undefined,
          specificname: undefined,
          tokens: [],
        },
      ],
      capabilities: [
        {
          type: 'sensor',
          name: 'EXAMPLE-SWITCH_SENSOR',
          label: 'my%20switch',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/EXAMPLE-SWITCH_SENSOR',
          sensor: {
            type: 'binary',
          },
        },
        {
          type: 'switch',
          name: 'example-switch',
          label: 'my%20switch',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-switch',
          sensor: 'EXAMPLE-SWITCH_SENSOR',
        },
      ],
    });
  });

  it('should report if device supports timing - false', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .setType('ACCESSOIRE');

    const supportsTiming = device.supportsTiming();
    expect(supportsTiming).to.equal(false);
  });

  it('should report if device supports timing - true', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, () => '')
      .setType('GAMECONSOLE');

    const supportsTiming = device.supportsTiming();
    expect(supportsTiming).to.equal(true);
  });

  it('should build device with a directory', () => {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addDirectory(
        { name: 'example-directory', label: 'my directory' },
        { getter: () => new ListBuilder(), action: () => {} }
      )
      .build();

    // @ts-ignore
    delete device.handler;
    // @ts-ignore
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      adapterName: 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      apiversion: '1.0',
      type: 'ACCESSOIRE',
      manufacturer: 'NEEO',
      driverVersion: undefined,
      initialiseFunction: undefined,
      timing: undefined,
      setup: {},
      deviceCapabilities: [],
      devices: [
        {
          name: 'example-adapter',
          specificname: undefined,
          icon: undefined,
          tokens: [],
        },
      ],
      capabilities: [
        {
          identifier: undefined,
          role: undefined,
          label: 'my%20directory',
          name: 'example-directory',
          path:
            '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-directory',
          type: 'directory',
        },
      ],
    });
  });

  it('should fail to add a directory with an already existing role', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addDirectory(
          { name: 'example-directory', label: 'my directory', role: 'ROOT' },
          { getter: () => new ListBuilder(), action: () => {} }
        )
        .addDirectory(
          {
            name: 'example-directory2',
            label: 'my directory 2',
            role: 'ROOT',
          },
          { getter: () => new ListBuilder(), action: () => {} }
        );
    }).to.throw(/INVALID_DIRECTORY_ROLE_ALREADY_DEFINED/);
  });

  it('should fail to add directory without controller action', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addDirectory(
          { name: 'example-directory', label: 'my directory' },
          // @ts-ignore
          { getter: () => new ListBuilder() }
        );
    }).to.throw(/INVALID_DIRECTORY_CONTROLLER_ACTION_NOT_A_FUNCTION/);
  });

  it('should fail to add directory without controller getter', () => {
    expect(() => {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addDirectory(
          { name: 'example-directory', label: 'my directory' },
          // @ts-ignore
          { action: () => {} }
        );
    }).to.throw(/INVALID_DIRECTORY_CONTROLLER_GETTER_NOT_A_FUNCTION/);
  });

  it('should fail to add a directory with an invalid role', () => {
    expect(() =>
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addDirectory(
          { name: 'example-directory', label: 'my directory', role: 'MyRole' },
          { getter: () => new ListBuilder(), action: () => {} }
        )
    ).to.throw(/INVALID_DIRECTORY_ROLE/);
  });
});
