'use strict';

const expect = require('chai').expect;
const DeviceCapability = require('../../../../lib/device/devicecapability');

describe('./lib/device/devicecapability.js', function() {

  describe('build()', function() {
    it('should fail to build devicecapability, no parameters', function() {
      expect(function() {
        DeviceCapability.build();
      }).to.throw(/INVALID_PARAMETERS/);
    });

    it('should fail to build devicecapability, invalid parameters', function() {
      expect(function() {
        DeviceCapability.build({}, {});
      }).to.throw(/INVALID_PARAMETERS/);
    });

    it('should build empty devicecapability', function() {
      const data = buildMockDeviceData();

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([]);
      expect(result.handlers.size).to.equal(0);
    });

    it('should fail if discovery missing', function() {
      const data = buildMockDeviceData();
      data.deviceCapabilities = ['addAnotherDevice'];

      expect(() => {
        DeviceCapability.build(data, 'unittest');
      }).to.throw(/DISCOVERY_REQUIRED/);
    });

    it('should build devicecapability with one button, make sure devicehandler can be accessed using the encoded name', function() {
      const data = buildMockDeviceData();
      data.buttons = [{
        param: { name: 'power on', label: 'Power On' },
        controller: function() {},
      }];

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([
        { type:'button', name:'power%20on', label:'Power On', path:'/device/deviceId/power%20on' },
      ]);
      expect(result.handlers.size).to.equal(1);
      expect(typeof result.handlers.get('power on')).to.equal('object');
      expect(typeof result.handlers.get('power%20on')).to.equal('undefined');
    });

    it('should build text and corresponding sensor', function() {
      const data = buildMockDeviceData();
      data.textLabels = [{
        param: { name: 'text', label: 'Text', isLabelVisible: true },
        controller: {
          getter: () => {},
          setter: () => {},
        },
      }];

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'TEXT_SENSOR',
          label: 'Text',
          path: '/device/deviceId/TEXT_SENSOR',
          sensor: { type: 'string' },
        },
        {
          type: 'textlabel',
          name: 'text',
          label: 'Text',
          sensor: 'TEXT_SENSOR',
          isLabelVisible: true,
          path: '/device/deviceId/text',
        },
      ]);
    });

    it('should build image and corresponding sensor', function() {
      const data = buildMockDeviceData();
      data.imageUrls = [{
        param: { name: 'image', label: 'Image', uri: 'img' },
        controller: {
          getter: () => {},
          setter: () => {},
        },
      }];

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'IMAGE_SENSOR',
          label: 'Image',
          path: '/device/deviceId/IMAGE_SENSOR',
          sensor: { type: 'string' },
        },
        {
          type: 'imageurl',
          size: 'large',
          imageUri: 'img',
          name: 'image',
          label: 'Image',
          sensor: 'IMAGE_SENSOR',
          path: '/device/deviceId/image',
        },
      ]);
    });

    it('should build switch and corresponding sensor', function() {
      const data = buildMockDeviceData();
      data.switches = [{
        param: { name: 'switch', label: 'Switch' },
        controller: {
          getter: () => {},
          setter: () => {},
        },
      }];

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'SWITCH_SENSOR',
          label: 'Switch',
          path: '/device/deviceId/SWITCH_SENSOR',
          sensor: { type: 'binary' },
        },
        {
          type: 'switch',
          name: 'switch',
          label: 'Switch',
          sensor: 'SWITCH_SENSOR',
          path: '/device/deviceId/switch',
        },
      ]);
    });

    it('should build slider and corresponding sensor', function() {
      const data = buildMockDeviceData();
      data.sliders = [{
        param: { name: 'slider', label: 'Slider' },
        controller: {
          getter: () => {},
          setter: () => {},
        },
      }];

      const result = DeviceCapability.build(data, 'unittest');

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'SLIDER_SENSOR',
          label: 'Slider',
          path: '/device/deviceId/SLIDER_SENSOR',
          sensor: {
            type: 'range',
            unit: '%',
            range: [0,100],
          },
        },
        {
          type: 'slider',
          name: 'slider',
          label: 'Slider',
          slider: {
            type: 'range',
            unit: '%',
            range: [0,100],
            sensor: 'SLIDER_SENSOR',
          },
          path: '/device/deviceId/slider',
        },
      ]);
    });
  });

  function buildMockDeviceData() {
    return {
      buttons: [],
      sliders: [],
      textLabels: [],
      imageUrls: [],
      switches: [],
      sensors: [],
      directories: [],
      discovery: [],
      deviceCapabilities: [],
      registration: [],
      deviceidentifier: 'deviceId',
    };
  }

});
