'use strict';

import { expect } from 'chai';
import * as validation from '../../../../../src/lib/device/validation';

describe('./lib/device/validation.ts', () => {
  it('should create unique name', () => {
    const name1 = validation.getUniqueName('foo');
    const name2 = validation.getUniqueName('foo');
    expect(name1).to.equal(name2);
  });

  it('should get button group', () => {
    const result = validation.getButtonGroup('Volume');
    expect(result.length).to.equal(3);
    expect(result).to.deep.equal(['VOLUME UP', 'VOLUME DOWN', 'MUTE TOGGLE']);
  });

  it('should get ip address', () => {
    const result = validation.getAnyIpAddress();
    expect(result.length > 3).to.equal(true);
  });

  it('should return false when calling stringLength with invalid parameters', () => {
    // @ts-ignore
    const result = validation.stringLength();
    expect(result).to.equal(false);
  });

  it('should fail stringLength check', () => {
    const result = validation.stringLength('aaa', 1);
    expect(result).to.equal(false);
  });

  it('should succeed stringLength check', () => {
    const result = validation.stringLength('aaa', 5);
    expect(result).to.equal(true);
  });

  describe('validateController', () => {
    let options;

    beforeEach(() => {
      options = {
        requiredFunctions: [],
        handlerName: 'UNIT_TEST',
      };
    });

    it('should reject undefined controller', () => {
      const controller = undefined;
      expect(() => {
        validation.validateController(controller, options);
      }).to.throw(`INVALID_${options.handlerName}_CONTROLLER undefined`);
    });

    it('should reject undefined controller including optional component name', () => {
      const controller = undefined;
      options.componentName = 'unitTest';
      expect(() => {
        validation.validateController(controller, options);
      }).to.throw(`INVALID_${options.handlerName}_CONTROLLER of ${options.componentName} undefined`);
    });

    it('should list missing properties when rejecting', () => {
      options.requiredFunctions = ['notMissing', 'missing', 'alsoMissing'];
      const controller = {
        notMissing: () => {},
      };
      expect(() => {
        validation.validateController(controller, options);
      }).to.throw(`INVALID_${options.handlerName}_CONTROLLER missing missing, alsoMissing function(s)`);
    });

    it('should list missing properties when rejecting with comonent name', () => {
      options.requiredFunctions = ['notMissing', 'missingFunction'];
      options.componentName = 'unitTest';
      const controller = {
        notMissing: () => {},
      };
      expect(() => {
        validation.validateController(controller, options);
      }).to.throw(`INVALID_${options.handlerName}_CONTROLLER of unitTest missing missingFunction function(s)`);
    });

    it('should accept valid controller', () => {
      const controller = {
        functionF: () => {},
        functionA: () => {},
        functionC: () => {},
        functionE: () => {},
      };
      options.requiredFunctions = Object.keys(controller);
      expect(() => {
        validation.validateController(controller, options);
      }).to.not.throw();
    });
  });
});
