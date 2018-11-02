'use strict';

import { expect } from 'chai';
import { DeviceBuilder } from '../../../../src/lib/device/deviceBuilder';
import buildDeviceCapability from '../../../../src/lib/device/deviceCapability';
import * as Models from '../../../../src/lib/models';

describe('./lib/device/deviceCapability.ts', () => {
  describe('build()', () => {
    it('should fail to build devicecapability, no parameters', () => {
      expect(() => {
        // @ts-ignore
        buildDeviceCapability();
      }).to.throw(/INVALID_PARAMETERS/);
    });

    it('should fail to build devicecapability, invalid parameters', () => {
      expect(() => {
        // @ts-ignore
        buildDeviceCapability(4);
      }).to.throw(/INVALID_PARAMETERS/);
    });

    it('should fail to build devicecapability, empty object', () => {
      expect(() => {
        // @ts-ignore
        buildDeviceCapability({});
      }).to.throw(/EMPTY_OBJECT/);
    });

    it('should build empty devicecapability', () => {
      const data = buildMockDeviceData();

      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([]);
      expect(result.handlers.size).to.equal(0);
    });

    it('should fail if discovery missing', () => {
      const data = buildMockDeviceData();
      data.addCapability('addAnotherDevice');

      expect(() => {
        buildDeviceCapability(data);
      }).to.throw(/DISCOVERY_REQUIRED/);
    });

    it('should not fail if discovery missing but dynamic device is defined', () => {
      const data = buildMockDeviceData();
      // @ts-ignore
      data.deviceCapabilities = ['addAnotherDevice', 'dynamicDevice'];

      const result = buildDeviceCapability(data);
      expect(typeof result).to.equal('object');
    });

    // tslint:disable-next-line:max-line-length
    it('should build devicecapability with one button, make sure devicehandler can be accessed using the encoded name', () => {
      const data = buildMockDeviceData();
      data.addButton({ name: 'power on', label: 'Power On' }).addButtonHandler(() => {});
      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([
        {
          type: 'button',
          name: 'power%20on',
          label: 'Power%20On',
          path: `/device/${data.deviceidentifier}/power%20on`,
        },
      ]);
      expect(result.handlers.size).to.equal(1);
      expect(typeof result.handlers.get('power on')).to.equal('object');
      expect(typeof result.handlers.get('power%20on')).to.equal('undefined');
    });

    it('should build text and corresponding sensor', () => {
      const data = buildMockDeviceData();
      data.addTextLabel(
        { name: 'text', label: 'Text', isLabelVisible: true },
        (deviceId) => 'text'
      );

      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'TEXT_SENSOR',
          label: 'Text',
          path: `/device/${data.deviceidentifier}/TEXT_SENSOR`,
          sensor: { type: 'string' },
        },
        {
          type: 'textlabel',
          name: 'text',
          label: 'Text',
          sensor: 'TEXT_SENSOR',
          isLabelVisible: true,
          path: `/device/${data.deviceidentifier}/text`,
        },
      ]);
    });

    it('should build image and corresponding sensor', () => {
      const data = buildMockDeviceData();
      data.addImageUrl({ name: 'image', label: 'Image', uri: 'img', size: 'small' }, () => 'text');

      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'IMAGE_SENSOR',
          label: 'Image',
          path: `/device/${data.deviceidentifier}/IMAGE_SENSOR`,
          sensor: { type: 'string' },
        },
        {
          type: 'imageurl',
          size: 'small',
          imageUri: 'img',
          name: 'image',
          label: 'Image',
          sensor: 'IMAGE_SENSOR',
          path: `/device/${data.deviceidentifier}/image`,
        },
      ]);
    });

    it('should build switch and corresponding sensor', () => {
      const data = buildMockDeviceData();
      data.addSwitch({ name: 'switch', label: 'Switch' }, { getter: () => true, setter: () => {} });

      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'SWITCH_SENSOR',
          label: 'Switch',
          path: `/device/${data.deviceidentifier}/SWITCH_SENSOR`,
          sensor: { type: 'binary' },
        },
        {
          type: 'switch',
          name: 'switch',
          label: 'Switch',
          sensor: 'SWITCH_SENSOR',
          path: `/device/${data.deviceidentifier}/switch`,
        },
      ]);
    });

    it('should build slider and corresponding sensor', () => {
      const data = buildMockDeviceData();
      data.addSlider({ name: 'slider', label: 'Slider' }, { getter: () => 100, setter: () => {} });

      const result = buildDeviceCapability(data);

      expect(result.capabilities).to.deep.equal([
        {
          type: 'sensor',
          name: 'SLIDER_SENSOR',
          label: 'Slider',
          path: `/device/${data.deviceidentifier}/SLIDER_SENSOR`,
          sensor: {
            type: 'range',
            unit: '%',
            range: [0, 100],
          },
        },
        {
          type: 'slider',
          name: 'slider',
          label: 'Slider',
          slider: {
            type: 'range',
            unit: '%',
            range: [0, 100],
            sensor: 'SLIDER_SENSOR',
          },
          path: `/device/${data.deviceidentifier}/slider`,
        },
      ]);
    });
  });

  function buildMockDeviceData(): Models.DeviceBuilder {
    return new DeviceBuilder('device');
  }
});
