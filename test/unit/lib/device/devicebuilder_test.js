'use strict';

const expect = require('chai').expect;
const DeviceBuilder = require('../../../../lib/device/devicebuilder');

describe('./lib/device/devicebuilder.js', function() {

  it('should fail to create device, no capabilities', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .build('foo');
    }).to.throw(/INVALID_DEVICE_DESCRIPTION_NO_CAPABILITIES/);
  });

  it('should fail to create device, invalid devicetype', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('foo')
        .addAdditionalSearchToken('foo')
        .addAdditionalSearchToken('bar')
        .build('foo');
    }).to.throw(/INVALID_DEVICETYPE/);
  });

  it('should fail to create device, missing button controller', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'run-one', label: 'button one' })
        .addButton({ name: 'run-two', label: 'button two' })
        .build('foo');
    }).to.throw(/BUTTONS_DEFINED_BUT_NO_BUTTONHANDLER_DEFINED/);
  });

  it('should fail to create device, duplicate names (button)', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(function(){})
        .build('foo');
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should fail to create device, multiple buttonhandler', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(function(){})
        .addButtonHandler(function(){});
    }).to.throw(/BUTTONHANDLER_ALREADY_DEFINED/);
  });

  it('should fail to create device, invalid enableDiscovery', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .enableDiscovery({ headerText:'', description:'' }, function(){});
    }).to.throw(/INVALID_DISCOVERY_PARAMETER/);
  });

  it('should fail to create device, multiple enableDiscovery', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .enableDiscovery({ headerText:'x', description:'x' }, function(){})
        .enableDiscovery({ headerText:'x', description:'x' }, function(){});
    }).to.throw(/DISCOVERHANLDER_ALREADY_DEFINED/);
  });

  it('should fail to create device, multiple initialiseFunctions', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .registerInitialiseFunction(function(){})
        .registerInitialiseFunction(function(){});
    }).to.throw(/INITIALISATION_FUNCTION_ALREADY_DEFINED/);
  });

  it('should fail to create device, multiple registerSubscriptionFunction', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .registerSubscriptionFunction(function(){})
        .registerSubscriptionFunction(function(){});
    }).to.throw(/SUBSCRIPTIONHANDLER_ALREADY_DEFINED/);
  });

  it('should fail to create device, controller is not a function', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-button', label: 'my button' })
        .addButtonHandler(3)
        .build('foo');
    }).to.throw(/MISSING_BUTTONHANDLER_CONTROLLER_PARAMETER/);
  });

  it('should fail to create device, duplicate names (button and slider)', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addButton({ name: 'example-foo', label: 'my button' })
        .addButtonHandler(function(){})
        .addSlider({ name: 'example-foo', label: 'my slider', range: [0,200], unit: '@' },
          { setter: function() {}, getter: function() {} })
        .build('foo');
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should fail to create device, missing param.name', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addSlider({ label: 'my slider', range: [0,200], unit: '@' },
          { setter: function() {}, getter: function() {} })
        .build('foo');
    }).to.throw(/MISSING_ELEMENT_NAME/);
  });

  it('should fail to create device, invalid timing parameter', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({})
        .build('foo');
    }).to.throw(/INVALID_TIMING_PARAMETER/);
  });

  it('should fail to create device, devicetype does not support timing', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('LIGHT')
        .defineTiming({ powerOnDelayMs: 500 })
        .build('foo');
    }).to.throw(/TIMING_DEFINED_BUT_DEVICETYPE_HAS_NO_SUPPORT/);
  });

  it('should fail to create device, invalid timing data (string)', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({ powerOnDelayMs: 'lala' })
        .build('foo');
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, invalid timing data (negative)', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({ powerOnDelayMs: -55 })
        .build('foo');
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, invalid timing data (too large)', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .setType('TV')
        .defineTiming({ powerOnDelayMs: 999999999 })
        .build('foo');
    }).to.throw(/INVALID_TIMING_VALUE/);
  });

  it('should fail to create device, multiple power state definitions', function() {
    expect(function() {
      new DeviceBuilder('example-adapter')
        .setManufacturer('NEEO')
        .addPowerStateSensor({ getter: function() {} })
        .addPowerStateSensor({ getter: function() {} })
        .build('foo');
    }).to.throw(/DUPLICATE_PATH_DETECTED/);
  });

  it('should build device defined adapter names', function() {
    const Device1 = new DeviceBuilder('example-adapter', 'XXX');
    const device1 = Device1
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('foo');
    const Device2 = new DeviceBuilder('example-adapter', 'XXX');
    const device2 = Device2
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('foo');
    expect(device1.adapterName).to.deep.equal(device2.adapterName);
  });

  it('should build device with a button', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('light')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('foo');

    delete device.handler;
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'LIGHT',
      'manufacturer': 'NEEO',
      'setup': {},
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [
            'foo',
            'bar'
          ],
        }
      ],
      'capabilities': [{
        'type': 'button',
        'name': 'example-button',
        'label': 'my button',
        'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button'
      }]
    });
  });

  it('should build device with a button and a custom device icon', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('mediaplayer')
      .setIcon('sonos')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('foo');

    delete device.handler;
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'MEDIAPLAYER',
      'manufacturer': 'NEEO',
      'setup': {},
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [
            'foo',
            'bar'
          ],
          'icon': 'sonos',
        }
      ],
      'capabilities': [{
        'type': 'button',
        'name': 'example-button',
        'label': 'my button',
        'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button'
      }]
    });
  });

  it('should build device with a button and a custom specific device name', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addAdditionalSearchToken('foo')
      .addAdditionalSearchToken('bar')
      .setType('mediaplayer')
      .setIcon('sonos')
      .setSpecificName('VERY SPECIFIC')
      .addButton({ name: 'example-button', label: 'my button' })
      .addButtonHandler(function(){})
      .build('foo');

    delete device.handler;
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'MEDIAPLAYER',
      'manufacturer': 'NEEO',
      'setup': {},
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [
            'foo',
            'bar'
          ],
          'icon': 'sonos',
          'specificname': 'VERY SPECIFIC'
        }
      ],
      'capabilities': [{
        'type': 'button',
        'name': 'example-button',
        'label': 'my button',
        'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-button'
      }]
    });
  });

  it('should build device with a subscriptionFunction', function() {
    let callback;

    function registerCallback(cb) {
      callback = cb;
    }

    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .registerSubscriptionFunction(registerCallback)
      .build('foo');

    expect(device.subscriptionFunction).to.deep.equal(registerCallback);
  });

  it('should build device, use button group', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addButtonGroup('volume')
      .addButtonHandler(function(){})
      .build('foo');
    expect(device.capabilities.length).to.equal(3);
  });

  it('should build device with a text label', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name: 'labelname', label: 'label' }, function() {
      })
      .build('foo');

    const handler = device.handler.get('LABELNAME_SENSOR');
    expect(typeof handler.controller.getter).to.equal('function');

    delete device.handler;
    delete device.subscriptionFunction;
    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'ACCESSOIRE',
      'manufacturer': 'NEEO',
      'setup': {},
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [],
        }
      ],
      'capabilities': [{
        'type': 'sensor',
        'name': 'LABELNAME_SENSOR',
        'label': 'label',
        'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/LABELNAME_SENSOR',
        'sensor': {
          'type': 'custom',
        }
      },
        {
          'type': 'textlabel',
          'name': 'labelname',
          'label': 'label',
          'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/labelname',
          'sensor': 'LABELNAME_SENSOR'
      }]
    });
  });

  it('should build device with a slider and enabled discovery', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .setType('light')
      .enableDiscovery({ headerText:'header text', description:'some hints' }, function(){})
      .addSlider({ name: 'example-slider', label: 'my slider', range: [0,200], unit: '@' },
        { setter: function() {}, getter: function() {} })
      .build('foo');

    delete device.handler;
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'LIGHT',
      'manufacturer': 'NEEO',
      'setup': {
        'discovery': true,
        'registration': false,
        'introheader': 'header text',
        'introtext': 'some hints'
      },
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [],
        }
      ],
      'capabilities': [
        {
          'type': 'sensor',
          'name': 'EXAMPLE-SLIDER_SENSOR',
          'label': 'my slider',
          'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/EXAMPLE-SLIDER_SENSOR',
          'sensor': {
            'type': 'range',
            'range': [
              0,
              200
            ],
            'unit': '%40'
          }
        },
        {
          'type': 'slider',
          'name': 'example-slider',
          'label': 'my slider',
          'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-slider',
          'slider': {
            'type': 'range',
            'sensor': 'EXAMPLE-SLIDER_SENSOR',
            'range': [
              0,
              200
            ],
            'unit': '%40'
          }
        }
      ]
    });
  });

  it('should build device with a initialise function', function() {
    function initFunction() {}
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .registerInitialiseFunction(initFunction)
      .build('foo');
    expect(device.initialiseFunction).to.equal(initFunction);
  });

  it('should build device with full timing', function() {
    const powerOnDelayMs = 1111;
    const sourceSwitchDelayMs = 2222;
    const shutdownDelayMs = 3333;
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .setType('VOD')
      .defineTiming({
        powerOnDelayMs,
        sourceSwitchDelayMs,
        shutdownDelayMs
      })
      .build('foo');
    expect(device.timing.standbyCommandDelay).to.equal(powerOnDelayMs);
    expect(device.timing.sourceSwitchDelay).to.equal(sourceSwitchDelayMs);
    expect(device.timing.shutdownDelay).to.equal(shutdownDelayMs);
  });

  it('should build device with partial timing', function() {
    const powerOnDelayMs = 1111;
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .setType('VOD')
      .defineTiming({
        powerOnDelayMs
      })
      .build('foo');
    expect(device.timing.standbyCommandDelay).to.equal(powerOnDelayMs);
    expect(device.timing.sourceSwitchDelay).to.equal(undefined);
    expect(device.timing.shutdownDelay).to.equal(undefined);
  });

  it('should build device with alwayOn capability', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .setType('VOD')
      .addCapability('alwaysOn')
      .build('foo');
    expect(device.deviceCapabilities).to.deep.equal(['alwaysOn']);
  });

  it('should fail to build a device with an invalid capability', function() {
    expect(function() {
      new DeviceBuilder('example-adapter', 'XXX')
        .setManufacturer('NEEO')
        .addTextLabel({ name:'labelname', label: 'label' }, function(){})
        .setType('LIGHT')
        .addCapability('invalid');
    }).to.throw(/INVALID_CAPABILITY/);
  });

  it('should build device with powerstate sensor', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addPowerStateSensor({ getter: function() {}})
      .build('foo');

    expect(device.capabilities.length).to.equal(1);
    const powerstateCapability = device.capabilities[0];
    expect(powerstateCapability.label).to.equal('Powerstate');
    expect(powerstateCapability.name).to.equal('powerstate');
    expect(powerstateCapability.sensor.type).to.equal('power');
  });

  it('should build device with a switch', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addSwitch({ name: 'example-switch', label: 'my switch' },
        { setter: function() {}, getter: function() {} })
      .build('foo');

    delete device.handler;
    delete device.subscriptionFunction;

    expect(device).to.deep.equal({
      'adapterName': 'apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50',
      'apiversion': '1.0',
      'type': 'ACCESSOIRE',
      'manufacturer': 'NEEO',
      'setup': {},
      'deviceCapabilities': [],
      'devices': [
        {
          'name': 'example-adapter',
          'tokens': [],
        }
      ],
      'capabilities': [
        {
          'type': 'sensor',
          'name': 'EXAMPLE-SWITCH_SENSOR',
          'label': 'my switch',
          'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/EXAMPLE-SWITCH_SENSOR',
          'sensor': {
            'type': 'binary'
          }
        },
        {
          'type': 'switch',
          'name': 'example-switch',
          'label': 'my switch',
          'path': '/device/apt-d8ffe38dfb9b37c867e3d9c97e5b670a8f8efc50/example-switch',
          'sensor': 'EXAMPLE-SWITCH_SENSOR'
        }
      ]
    });
  });

  it('should report if device supports timing - false', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .setType('ACCESSOIRE');

    const supportsTiming = device.supportsTiming();
    expect(supportsTiming).to.equal(false);
  });

  it('should report if device supports timing - true', function() {
    const device = new DeviceBuilder('example-adapter', 'XXX')
      .setManufacturer('NEEO')
      .addTextLabel({ name:'labelname', label: 'label' }, function(){})
      .setType('GAMECONSOLE');

    const supportsTiming = device.supportsTiming();
    expect(supportsTiming).to.equal(true);
  });

});
