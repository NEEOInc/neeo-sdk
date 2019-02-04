import { expect } from 'chai';
import * as validate from '../../../../../src/lib/device/validation/helper';

const EXPECTED_INTEGER_ERROR = 'Validation failed: no integer';
const EXPECTED_STRING_ERROR = 'Validation failed: no string';
const EXPECTED_ARRAY_ERROR = 'Validation failed: no array';
const EXPECTED_PROPERTY_ERROR = /not present/;

describe('./lib/device/validation/helper.ts', () => {
  describe('isInteger()', () => {
    it('should be okay with integer', () => {
      // GIVEN
      const input = 3;

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.not.throw;
    });

    it('should fail on undefined', () => {
      // GIVEN
      const input = undefined;

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on null', () => {
      // GIVEN
      const input = null;

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on float', () => {
      // GIVEN
      const input = 3.14;

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on string', () => {
      // GIVEN
      const input = '3';

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on boolean', () => {
      // GIVEN
      const input = true;

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on object', () => {
      // GIVEN
      const input = { foo: 2 };

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });

    it('should fail on array', () => {
      // GIVEN
      const input = [2];

      // WHEN
      expect(() => {
        validate.isInteger(input);
      }).to.throw(EXPECTED_INTEGER_ERROR);
    });
  });

  describe('isString()', () => {
    it('should be okay with string', () => {
      // GIVEN
      const input = 'string';

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.not.throw;
    });

    it('should fail on undefined', () => {
      // GIVEN
      const input = undefined;

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on null', () => {
      // GIVEN
      const input = null;

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on integer', () => {
      // GIVEN
      const input = 3;

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on float', () => {
      // GIVEN
      const input = 3.14;

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on boolean', () => {
      // GIVEN
      const input = true;

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on object', () => {
      // GIVEN
      const input = { foo: 'string' };

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });

    it('should fail on array', () => {
      // GIVEN
      const input = ['string'];

      // WHEN
      expect(() => {
        validate.isString(input);
      }).to.throw(EXPECTED_STRING_ERROR);
    });
  });

  describe('isArray()', () => {
    it('should be okay with array', () => {
      // GIVEN
      const input = ['arr'];

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.not.throw;
    });

    it('should fail on undefined', () => {
      // GIVEN
      const input = undefined;

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on null', () => {
      // GIVEN
      const input = null;

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on integer', () => {
      // GIVEN
      const input = 3;

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on float', () => {
      // GIVEN
      const input = 3.14;

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on boolean', () => {
      // GIVEN
      const input = true;

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on object', () => {
      // GIVEN
      const input = { foo: 'string' };

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });

    it('should fail on string', () => {
      // GIVEN
      const input = 'string';

      // WHEN
      expect(() => {
        validate.isArray(input);
      }).to.throw(EXPECTED_ARRAY_ERROR);
    });
  });

  describe('ensurePropertyValue()', () => {
    const property = 'prop';

    it('should be okay with existing property', () => {
      // GIVEN
      const input = { prop: 'hi!' };

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.not.throw;
    });

    it('should fail on undefined', () => {
      // GIVEN
      const input = undefined;

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });

    it('should fail on null', () => {
      // GIVEN
      const input = null;

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });

    it('should fail on integer', () => {
      // GIVEN
      const input = 3;

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });

    it('should fail if property does not exist', () => {
      // GIVEN
      const input = { someOtherProp: true };

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });

    it('should fail if property exists but is null', () => {
      // GIVEN
      const input = { prop: null };

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });

    it('should fail if property exists but is undefined', () => {
      // GIVEN
      const input = { prop: undefined };

      // WHEN
      expect(() => {
        validate.ensurePropertyValue(input, property);
      }).to.throw(EXPECTED_PROPERTY_ERROR);
    });
  });
});
