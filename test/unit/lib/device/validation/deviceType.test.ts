import { expect } from 'chai';
import * as devicetype from '../../../../../src/lib/device/validation/deviceType';
import { DeviceType } from '../../../../../src/lib/models/deviceType';

describe('./lib/device/validation/deviceType.ts', () => {
  describe('getDeviceType', () => {
    it('should get TV devicetype', () => {
      const result = devicetype.getDeviceType('tv');
      expect(result).to.equal('TV');
    });

    it('should get ACCESSORY devicetype', () => {
      const result = devicetype.getDeviceType('ACCESSORY');
      expect(result).to.equal('ACCESSOIRE');
    });

    it('should get ACCESSOIRE devicetype - deprecated and used only for backwards compability', () => {
      const result = devicetype.getDeviceType('ACCEssoire');
      expect(result).to.equal('ACCESSOIRE');
    });

    it('should throw error when requesting invalid devicetype', () => {
      expect(() => {
        devicetype.getDeviceType('foo');
      }).to.throw(/INVALID_DEVICETYPE_foo/);
    });
  });

  describe('needsInputCommand', () => {
    const testCases = [
      { type: 'AVRECEIVER', needsInput: true },
      { type: 'TV', needsInput: true },
      { type: 'PROJECTOR', needsInput: true },
      { type: 'HDMISWITCH', needsInput: true },
      { type: 'MEDIAPLAYER', needsInput: false },
      { type: 'GAMECONSOLE', needsInput: false },
    ];

    testCases.forEach((testCase) => {
      const negated = testCase.needsInput ? '' : 'not ';
      it(`${negated}for ${testCase.type} devices`, () => {
        const inputCommandNeeded = devicetype.needsInputCommand(
          testCase.type as DeviceType
        );
        expect(inputCommandNeeded).to.equal(testCase.needsInput);
      });
    });
  });

  describe('doesNotSupportTiming', () => {
    const testCases = [
      { type: 'LIGHT', notSupported: true },
      { type: 'ACCESSOIRE', notSupported: true },
      { type: 'TV', notSupported: false },
    ];

    testCases.forEach((testCase) => {
      const negated = testCase.notSupported ? '' : 'not ';
      it(`${negated}for ${testCase.type} devices`, () => {
        const notSupported = devicetype.doesNotSupportTiming(
          testCase.type as DeviceType
        );
        expect(notSupported).to.equal(testCase.notSupported);
      });
    });
  });

  describe('hasFavoritesSupport', () => {
    const testCases = [
      { type: 'TV', supported: true },
      { type: 'DVB', supported: true },
      { type: 'TUNER', supported: true },
      { type: 'LIGHT', supported: false },
      { type: 'DVD', supported: false },
    ];

    testCases.forEach((testCase) => {
      const negated = testCase.supported ? '' : 'not ';
      it(`${negated}for ${testCase.type} devices`, () => {
        const support = devicetype.hasFavoritesSupport(
          testCase.type as DeviceType
        );
        expect(support).to.equal(testCase.supported);
      });
    });
  });

  describe('hasPlayerSupport', () => {
    const testCases = [
      { type: 'MEDIAPLAYER', supported: true },
      { type: 'MUSICPLAYER', supported: true },
      { type: 'VOD', supported: true },
      { type: 'DVB', supported: false },
      { type: 'TUNER', supported: false },
      { type: 'LIGHT', supported: false },
      { type: 'DVD', supported: false },
    ];

    testCases.forEach((testCase) => {
      const negated = testCase.supported ? '' : 'not ';
      it(`${negated}for ${testCase.type} devices`, () => {
        const support = devicetype.hasPlayerSupport(
          testCase.type as DeviceType
        );
        expect(support).to.equal(testCase.supported);
      });
    });
  });
});
