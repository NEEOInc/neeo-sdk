'use strict';

const expect = require('chai').expect;
const ComponentFactory = require('../../../../lib/device/componentfactory');

describe('./lib/device/componentfactory.js', function() {

  describe('buildButton()', function() {
    it('should set default label', function() {
      const param = { name: 'buttonname' };
      const button = ComponentFactory.buildButton('PREFIX/', param);
      expect(button).to.deep.equal({
        type: 'button',
        name: 'buttonname',
        label: 'buttonname',
        path: 'PREFIX/buttonname'
      });
    });

    it('should use optional label', function() {
      const param = { name: 'buttonname', label: 'a button' };
      const button = ComponentFactory.buildButton('PREFIX/', param);
      expect(button).to.deep.equal({
        type: 'button',
        name: 'buttonname',
        label: 'a button',
        path: 'PREFIX/buttonname'
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
      const param = { name: 'slidername' };
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername',
        label: 'slidername',
        path: 'PREFIX/slidername',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME_SENSOR',
          range: [0, 100],
          unit: '%'
        }
      });
    });

    it('should properly encode special characters in name', function() {
      const param = { name: 'slidername ✘✘ //\\<script>' };
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        label: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        path: 'PREFIX/slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3CSCRIPT%3E_SENSOR',
          range: [0, 100],
          unit: '%'
        }
      });
    });

    it('should respect optional parameters', function() {
      const param = { name: 'slidername', label: 'sliderfoo', range: [0, 10], unit: 'BAR' };
      const slider = ComponentFactory.buildRangeSlider('PREFIX/', param);
      expect(slider).to.deep.equal({
        type: 'slider',
        name: 'slidername',
        label: 'sliderfoo',
        path: 'PREFIX/slidername',
        slider: {
          type: 'range',
          sensor: 'SLIDERNAME_SENSOR',
          range: [0, 10],
          unit: 'BAR'
        }
      });
    });

    it('should fail with invalid range type', function() {
      expect(function() {
        const param = { name: 'slidername', label: 'sliderfoo', range: 'lala', unit: 'BAR' };
        ComponentFactory.buildRangeSlider('PREFIX/', param);
      }).to.throw(/INVALID_SLIDER_RANGE/);
    });

    it('should fail with invalid range values', function() {
      expect(function() {
        const param = { name: 'slidername', label: 'sliderfoo', range: ['lala', 'land'], unit: 'BAR' };
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
    it('should build a minimal range sensor', function() {
      const param = { name: 'aRangeSensor' };
      const sensor = ComponentFactory.buildSensor('PREFIX/', param);
      expect(sensor).to.deep.equal({
        type: 'sensor',
        name: 'aRangeSensor',
        label: 'aRangeSensor',
        path: 'PREFIX/aRangeSensor',
        sensor: {
          range: [0, 100],
          type: 'range',
          unit: '%'
        }
      });
    });

    it('should build a advanced range sensor', function() {
      const param = { name: 'aRangeSensor', label: 'foo', unit: '"', range: [5, 12] };
      const sensor = ComponentFactory.buildSensor('PREFIX/', param);
      expect(sensor).to.deep.equal({
        type: 'sensor',
        name: 'aRangeSensor',
        label: 'foo',
        path: 'PREFIX/aRangeSensor',
        sensor: {
          range: [5, 12],
          type: 'range',
          unit: '%22'
        }
      });
    });

    it('should build a power sensor', function() {
      const param = { name: 'aPowerSensor', label: 'foo', type: 'power' };
      const sensor = ComponentFactory.buildSensor('PREFIX/', param);
      expect(sensor).to.deep.equal({
        type: 'sensor',
        name: 'aPowerSensor',
        label: 'foo',
        path: 'PREFIX/aPowerSensor',
        sensor: {
          type: 'power',
        }
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
        sensor: 'TEXTLABEL_SENSOR'
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
        sensor: 'TEXTLABEL_SENSOR'
      });
    });

    it('should allow enabling the label', function() {
      const param = { name: 'textlabel', isLabelVisible: true };
      const textlabel = ComponentFactory.buildTextLabel('PREFIX/', param);
      expect(textlabel).to.deep.equal({
        type: 'textlabel',
        name: 'textlabel',
        label: 'textlabel',
        isLabelVisible: true,
        path: 'PREFIX/textlabel',
        sensor: 'TEXTLABEL_SENSOR'
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
      const param = { name: 'imageurl' };
      const image = ComponentFactory.buildImageUrl('PREFIX/', param);
      expect(image).to.deep.equal({
        type: 'imageurl',
        name: 'imageurl',
        label: 'imageurl',
        size: 'large',
        path: 'PREFIX/imageurl',
        imageUri: null,
        sensor: 'IMAGEURL_SENSOR'
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
        type: 'directory'
      });
    });

    it('should build a directory, using adapterName parameter', function() {
      const param = { name: 'directoryname', label: 'somelabel', adapterName: 'device' };
      const result = ComponentFactory.buildDirectory('PREFIX/', param);
      expect(result).to.deep.equal({
        name: 'directoryname',
        label: 'somelabel',
        path: 'PREFIX/directoryname',
        type: 'directory'
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
        type: 'discover'
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
        type: 'register'
      });
    });
  });

});
