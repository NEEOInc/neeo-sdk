'use strict';

const expect = require('chai').expect;
const ComponentFactory = require('../../../../lib/device/componentfactory');

describe('./lib/device/componentfactory.js', function() {

  it('should build a button', function() {
    const param = { name: 'buttonname'};
    const result = ComponentFactory.buildButton('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'button',
      name: 'buttonname',
      label: 'buttonname',
      path: 'PREFIX/buttonname'
    });
  });

  it('should build a button, using optional label', function() {
    const param = { name: 'buttonname', label: 'a button'};
    const result = ComponentFactory.buildButton('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'button',
      name: 'buttonname',
      label: 'a button',
      path: 'PREFIX/buttonname'
    });
  });

  it('should build a slider', function() {
    const param = { name: 'slidername'};
    const result = ComponentFactory.buildRangeSlider('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'slider',
      name: 'slidername',
      label: 'slidername',
      path: 'PREFIX/slidername',
      slider: {
        type: 'range',
        sensor: 'SLIDERNAME_SENSOR',
        range: [ 0, 100 ],
        unit: '%'
      }
    });
  });

  it('should build a textlabel, without label', function() {
    const param = { name: 'textlabel'};
    const result = ComponentFactory.buildTextLabel('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'textlabel',
      name: 'textlabel',
      label: 'textlabel',
      path: 'PREFIX/textlabel',
      sensor: 'TEXTLABEL_SENSOR'
    });
  });

  it('should build a slider with a fancy name', function() {
    const param = { name: 'slidername ✘✘ //\\<script>'};
    const result = ComponentFactory.buildRangeSlider('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'slider',
      name: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
      label: 'slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
      path: 'PREFIX/slidername%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3Cscript%3E',
      slider: {
        type: 'range',
        sensor: 'SLIDERNAME%20%E2%9C%98%E2%9C%98%20%2F%2F%5C%3CSCRIPT%3E_SENSOR',
        range: [ 0, 100 ],
        unit: '%'
      }
    });
  });

  it('should build a slider, using optional parameters', function() {
    const param = { name: 'slidername', label: 'sliderfoo', range: [0,10], unit: 'BAR'};
    const result = ComponentFactory.buildRangeSlider('PREFIX/', param);
    expect(result).to.deep.equal({
      type: 'slider',
      name: 'slidername',
      label: 'sliderfoo',
      path: 'PREFIX/slidername',
      slider: {
        type: 'range',
        sensor: 'SLIDERNAME_SENSOR',
        range: [ 0, 10 ],
        unit: 'BAR'
      }
    });
  });

  it('should fail to build a slider, invalid range', function() {
    expect(function() {
      const param = { name: 'slidername', label: 'sliderfoo', range: 'lala', unit: 'BAR'};
      ComponentFactory.buildRangeSlider('PREFIX/', param);
    }).to.throw(/INVALID_SLIDER_RANGE/);
  });

  it('should fail to build a slider, invalid range', function() {
    expect(function() {
      const param = { name: 'slidername', label: 'sliderfoo', range: ['lala', 'land'], unit: 'BAR'};
      ComponentFactory.buildRangeSlider('PREFIX/', param);
    }).to.throw(/INVALID_SLIDER_RANGE/);
  });

  it('should fail to build a button, missing pathprefix', function() {
    expect(function() {
      ComponentFactory.buildButton();
    }).to.throw(/INVALID_PATHPREFIX/);
  });

  it('should fail to build a slider, missing pathprefix', function() {
    expect(function() {
      ComponentFactory.buildRangeSlider();
    }).to.throw(/INVALID_PATHPREFIX/);
  });

  it('should fail to build a switch, missing pathprefix', function() {
    expect(function() {
      ComponentFactory.buildSwitch();
    }).to.throw(/INVALID_PATHPREFIX/);
  });

  it('should fail to build a button, missing build parameter', function() {
    expect(function() {
      ComponentFactory.buildButton('foo');
    }).to.throw(/INVALID_BUILD_PARAMETER/);
  });

  it('should fail to build a button, empty build parameter', function() {
    expect(function() {
      ComponentFactory.buildButton('foo', {});
    }).to.throw(/INVALID_BUILD_PARAMETER/);
  });

  it('should fail to build a textlabel, empty controller', function() {
    expect(function() {
      ComponentFactory.buildTextLabel('foo', {});
    }).to.throw(/INVALID_BUILD_PARAMETER/);
  });

});
