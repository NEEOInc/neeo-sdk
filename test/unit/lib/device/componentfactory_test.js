'use strict';

const expect = require('chai').expect;
const ComponentFactory = require('../../../../lib/device/componentfactory');

describe('./lib/device/componentfactory.js', function() {

  describe('getPathPrefix', function() {
    it('should return a path prefix', function() {
      const deviceidentifier = 'deviceidentifier';
      const pathPrefix = ComponentFactory.getPathPrefix(deviceidentifier);

      expect(pathPrefix).to.equal(`/device/${deviceidentifier}/`);
    });
  });

  describe('buildButton()', function() {
    it('should set default label', function() {
      const param = { name: 'buttonname'};
      const button = ComponentFactory.buildButton('PREFIX/', param);
      expect(button).to.deep.equal({
        type: 'button',
        name: 'buttonname',
        label: 'buttonname',
        path: 'PREFIX/buttonname',
      });
    });

    it('should use optional label', function() {
      const param = { name: 'buttonname', label: 'a button'};
      const button = ComponentFactory.buildButton('PREFIX/', param);
      expect(button).to.deep.equal({
        type: 'button',
        name: 'buttonname',
        label: 'a button',
        path: 'PREFIX/buttonname',
      });
    });

    it('should fail with missing pathprefix', function() {
      expect(function() {
        ComponentFactory.buildButton();
      }).to.throw(/INVALID_PATHPREFIX/);
    });

    it('should fail with missing build parameter', function() {
      expect(function() {
        ComponentFactory.buildButton('foo');
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });

    it('should fail with empty build parameter', function() {
      expect(function() {
        ComponentFactory.buildButton('foo', {});
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });
  });

  describe('buildRangeSlider', function() {
    it('should build a slider', function() {
      const param = { name: 'slidername'};
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername',
        label: 'slidername',
        path: 'PREFIX/slidername',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME_SENSOR',
          range: [ 0, 100 ],
          unit: '%',
        },
      });
    });

    it('should properly encode special characters in name', function() {
      const param = { name: 'slidername ✘✘ //\\<script>'};
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        label: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        path: 'PREFIX/slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3CSCRIPT%3E_SENSOR',
          range: [ 0, 100 ],
          unit: '%',
        },
      });
    });

    it('should respect optional parameters', function() {
      const param = { name: 'slidername', label: 'sliderfoo', range: [0,10], unit: 'BAR'};
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername',
        label: 'sliderfoo',
        path: 'PREFIX/slidername',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME_SENSOR',
          range: [ 0, 10 ],
          unit: 'BAR',
        },
      });
    });

    it('should fail with invalid range type', function() {
      expect(function() {
        const param = { name: 'slidername', label: 'sliderfoo', range: 'lala', unit: 'BAR'};
        ComponentFactory.buildRangeSlider('PREFIX/', param);
      }).to.throw(/INVALID_SLIDER_RANGE/);
    });

    it('should fail with invalid range values', function() {
      expect(function() {
        const param = { name: 'slidername', label: 'sliderfoo', range: ['lala', 'land'], unit: 'BAR'};
        ComponentFactory.buildRangeSlider('PREFIX/', param);
      }).to.throw(/INVALID_SLIDER_RANGE/);
    });

    it('should fail with missing pathprefix', function() {
      expect(function() {
        ComponentFactory.buildRangeSlider();
      }).to.throw(/INVALID_PATHPREFIX/);
    });
  });

  describe('buildSwitch()', function() {
    it('should fail with missing pathprefix', function() {
      expect(function() {
        ComponentFactory.buildSwitch();
      }).to.throw(/INVALID_PATHPREFIX/);
    });
  });

  describe('buildSensor()', function() {
    context('type range (default fallback)', function() {
      // TODO fix legacy build sensor functions without _SENSOR and lower case.
      it('should build a minimal range sensor if type not specified', function() {
        const param = { name: 'aRangeSensor' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'aRangeSensor',
          label: 'aRangeSensor',
          path: 'PREFIX/aRangeSensor',
          sensor: {
            range: [0,100],
            type: 'range',
            unit: '%',
          },
        });
      });

      // TODO fix legacy build sensor functions without _SENSOR and lower case.
      it('should build a advanced range sensor', function() {
        const param = { name: 'aRangeSensor', label: 'foo', unit: '"', range: [5, 12] };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'aRangeSensor',
          label: 'foo',
          path: 'PREFIX/aRangeSensor',
          sensor: {
            range: [5,12],
            type: 'range',
            unit: '%22',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'range', name: 'range', label: 'Range' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Range');
      });

      it('should use component sensorlabel if set', function() {
        const param = { type: 'range', name: 'range', sensorlabel: 'Range sensor', label: 'Range' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Range sensor');
      });
    });

    context('type range', function() {
      it('should slider sensor, using default fallbacks', function() {
        const param = { type: 'range', name: 'slider' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'SLIDER_SENSOR',
          label: 'slider',
          path: 'PREFIX/SLIDER_SENSOR',
          sensor: {
            type: 'range',
            range: [0, 100],
            unit: '%',
          },
        });
      });

      it('should use component unit if set', function() {
        const param = { type: 'range', name: 'slider', unit: 'mm' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.sensor.unit).to.equal('mm');
      });

      it('should use component range if set', function() {
        const param = { type: 'range', name: 'slider', range: [180,360] };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.sensor.range).to.deep.equal([180,360]);
      });

      it('should fail for invalid range type', function() {
        const param = { type: 'range', name: 'slider', range: '1 to 10' };
        expect(() => {
          ComponentFactory.buildSensor('PREFIX/', param);
        }).to.throw(/INVALID_SLIDER_RANGE/);
      });

      it('should fail for invalid range values', function() {
        const param = { type: 'range', name: 'slider', range: ['a','z'] };
        expect(() => {
          ComponentFactory.buildSensor('PREFIX/', param);
        }).to.throw(/INVALID_SLIDER_RANGE/);
      });

      it('should use component label if set', function() {
        const param = { type: 'range', name: 'slider', label: 'Slider' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Slider');
      });

      it('should prioritize sensorlabel if set', function() {
        const param = { type: 'range', name: 'slider', sensorlabel: 'Slider sensor', label: 'Slider' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Slider sensor');
      });
    });

    context('type power', function() {
      // TODO fix legacy build sensor functions without _SENSOR and lower case.
      it('should build a power sensor', function() {
        const param = { name: 'aPowerSensor', type: 'power' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'aPowerSensor',
          label: 'aPowerSensor',
          path: 'PREFIX/aPowerSensor',
          sensor: {
            type: 'power',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'power', name: 'power', label: 'Power' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Power');
      });

      it('should use sensorlabel if set', function() {
        const param = { type: 'power', name: 'power', sensorlabel: 'Power sensor', label: 'Power' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Power sensor');
      });
    });

    context('type binary', function() {
      it('should build sensor, using name as label fallback', function() {
        const param = { type: 'binary', name: 'binary' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'BINARY_SENSOR',
          label: 'binary',
          path: 'PREFIX/BINARY_SENSOR',
          sensor: {
            type: 'binary',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'binary', name: 'binary', label: 'Binary' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Binary');
      });

      it('should prioritize sensorlabel if set', function() {
        const param = { type: 'binary', name: 'binary', sensorlabel: 'Binary sensor', label: 'Binary' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Binary sensor');
      });
    });

    context('type custom', function() {
      it('should build custom sensor, using name as label fallback', function() {
        const param = { type: 'custom', name: 'custom' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'CUSTOM_SENSOR',
          label: 'custom',
          path: 'PREFIX/CUSTOM_SENSOR',
          sensor: {
            type: 'custom',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'custom', name: 'custom', label: 'Custom' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Custom');
      });

      it('should prioritize sensorlabel if set', function() {
        const param = { type: 'custom', name: 'custom', sensorlabel: 'Custom sensor', label: 'Custom' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Custom sensor');
      });
    });

    context('type string', function() {
      it('should build string sensor, using name as label fallback', function() {
        const param = { type: 'string', name: 'string' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'STRING_SENSOR',
          label: 'string',
          path: 'PREFIX/STRING_SENSOR',
          sensor: {
            type: 'string',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'string', name: 'string', label: 'String' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('String');
      });

      it('should prioritize sensorlabel if set', function() {
        const param = { type: 'string', name: 'string', sensorlabel: 'String sensor', label: 'String' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('String sensor');
      });
    });

    context('type array', function() {
      it('should switch sensor, using name as label fallback', function() {
        const param = { type: 'array', name: 'array' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor).to.deep.equal({
          type: 'sensor',
          name: 'ARRAY_SENSOR',
          label: 'array',
          path: 'PREFIX/ARRAY_SENSOR',
          sensor: {
            type: 'array',
          },
        });
      });

      it('should use component label if set', function() {
        const param = { type: 'array', name: 'array', label: 'Array' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Array');
      });

      it('should prioritize sensorlabel if set', function() {
        const param = { type: 'array', name: 'array', sensorlabel: 'Array sensor', label: 'Array' };
        const sensor = ComponentFactory.buildSensor('PREFIX/', param);
        expect(sensor.label).to.equal('Array sensor');
      });
    });
  });

  describe('buildTextLabel()', function() {
    it('should set default label value but not visible', function() {
      const param = { name: 'textlabel' };
      const textlabel = ComponentFactory.buildTextLabel('PREFIX/', param);
      expect(textlabel).to.deep.equal({
        type: 'textlabel',
        name: 'textlabel',
        label: 'textlabel',
        isLabelVisible: undefined,
        path: 'PREFIX/textlabel',
        sensor: 'TEXTLABEL_SENSOR',
      });
    });

    it('should respect isLabelVisible parameter when false', function() {
      const param = { name: 'textlabel', isLabelVisible: false };
      const textlabel = ComponentFactory.buildTextLabel('PREFIX/', param);
      expect(textlabel).to.deep.equal({
        type: 'textlabel',
        name: 'textlabel',
        label: 'textlabel',
        isLabelVisible: false,
        path: 'PREFIX/textlabel',
        sensor: 'TEXTLABEL_SENSOR',
      });
    });

    it('should allow enabling the label', function () {
      const param = { name: 'textlabel', isLabelVisible: true };
      const textlabel = ComponentFactory.buildTextLabel('PREFIX/', param);
      expect(textlabel).to.deep.equal({
        type: 'textlabel',
        name: 'textlabel',
        label: 'textlabel',
        isLabelVisible: true,
        path: 'PREFIX/textlabel',
        sensor: 'TEXTLABEL_SENSOR',
      });
    });

    it('should fail with empty controller', function() {
      expect(function() {
        ComponentFactory.buildTextLabel('foo', {});
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });
  });

  describe('buildImageUrl', function() {
    it('should fail with invalid size', function() {
      const param = { name: 'imageurl', size: 'invalid' };
      const fn = () => ComponentFactory.buildImageUrl('PREFIX/', param);
      expect(fn).to.throw(/INVALID_IMAGEURL_SIZE/);
    });

    it('should defaults to large when using no valid size definition', function() {
      const param = { name: 'imageurl', szie: 'large' };
      const image = ComponentFactory.buildImageUrl('PREFIX/', param);
      expect(image.size).to.equal('large');
    });

    it('should build an imageurl, without label', function() {
      const param = { name: 'imageurl'};
      const image = ComponentFactory.buildImageUrl('PREFIX/', param);
      expect(image).to.deep.equal({
        type: 'imageurl',
        name: 'imageurl',
        label: 'imageurl',
        size: 'large',
        path: 'PREFIX/imageurl',
        imageUri: null,
        sensor: 'IMAGEURL_SENSOR',
      });
    });

    it('should fail with empty controller', function() {
      expect(function() {
        ComponentFactory.buildImageUrl('foo', {});
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });
  });

  describe('buildDirectory()', function() {
    it('should build a directory, using parameters', function() {
      const param = { name: 'directoryname', label: 'somelabel' };
      const result = ComponentFactory.buildDirectory('PREFIX/', param);
      expect(result).to.deep.equal({
        name: 'directoryname',
        label: 'somelabel',
        path: 'PREFIX/directoryname',
        type: 'directory',
      });
    });

    it('should build a directory, using adapterName parameter', function() {
      const param = { name: 'directoryname', label: 'somelabel', adapterName: 'device' };
      const result = ComponentFactory.buildDirectory('PREFIX/', param);
      expect(result).to.deep.equal({
        name: 'directoryname',
        label: 'somelabel',
        path: 'PREFIX/directoryname',
        type: 'directory',
      });
    });

    it('should fail with missing build parameter', function() {
      expect(function() {
        ComponentFactory.buildDirectory('foo');
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });

    it('should fail with empty build parameter', function() {
      expect(function() {
        ComponentFactory.buildDirectory('foo', {});
      }).to.throw(/INVALID_BUILD_PARAMETER/);
    });
  });

  describe('buildDiscovery()', function() {
    it('should fail to build a discovery, missing build parameter', function() {
      expect(function() {
        ComponentFactory.buildDiscovery();
      }).to.throw(/INVALID_PATHPREFIX/);
    });

    it('should build a discovery component', function() {
      const PREFIX = '/foo';
      const result = ComponentFactory.buildDiscovery(PREFIX);
      expect(result).to.deep.equal({
        name: 'discover',
        path: PREFIX + 'discover',
        type: 'discover',
      });
    });
  });

  describe('buildRegister', function() {
    it('should fail to build a register, missing build parameter', function() {
      expect(function() {
        ComponentFactory.buildRegister();
      }).to.throw(/INVALID_PATHPREFIX/);
    });

    it('should build a register component', function() {
      const PREFIX = '/foo';
      const result = ComponentFactory.buildRegister(PREFIX);
      expect(result).to.deep.equal({
        name: 'register',
        path: PREFIX + 'register',
        type: 'register',
      });
    });
  });

});
