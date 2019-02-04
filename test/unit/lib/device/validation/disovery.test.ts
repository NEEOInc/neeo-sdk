import { expect } from 'chai';
import { validate } from '../../../../../src/lib/device/validation/discovery';
import { Discovery } from '../../../../../src/lib/models';

describe('./lib/device/validation/discovery', () => {
  describe('validate', () => {
    it('should reject for undefined options', () => {
      const args = {
        options: undefined,
        controller: () => {},
      };
      expectValidationOf(args)
        .to.throw(/INVALID_DISCOVERY_PARAMETER/);
    });

    it('should check for headerText', () => {
      const args = {
        options: {
          description: 'Looks for stuff',
        },
        controller: () => {},
      };
      expectValidationOf(args)
        .to.throw(/INVALID_DISCOVERY_PARAMETER: headerText/);
    });

    it('should reject for description', () => {
      const args = {
        options: {
          headerText: 'Discovery',
        },
        controller: () => {},
      };
      expectValidationOf(args)
        .to.throw(/INVALID_DISCOVERY_PARAMETER: description/);
    });

    it('should reject for undefined controller', () => {
      const args = {
        options: {
          headerText: 'Discovery',
          description: 'Looks for stuff',
        },
        controller: undefined,
      };
      expectValidationOf(args)
        .to.throw(/INVALID_DISCOVERY_FUNCTION/);
    });

    it('should access valid options', () => {
      const args = {
        options: {
          headerText: 'Discovery',
          description: 'Looks for stuff',
        },
        controller: () => {},
      };
      expectValidationOf(args)
        .to.not.throw();
    });
  });

  function expectValidationOf(args) {
    // Does type casting to avoid tslint/tscompile issues
    return expect(() => validate(
      args.options as Discovery.Options,
      args.controller as Discovery.Controller
    ));
  }
});
