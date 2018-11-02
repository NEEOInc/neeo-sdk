import { expect } from 'chai';
import * as devicetype from '../../../../../src/lib/device/validation/deviceType';

describe('./lib/device/validation/deviceType.ts', () => {
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

  it('AVRECEIVER need input commands', () => {
    const result = devicetype.needsInputCommand('AVRECEIVER');
    expect(result).to.equal(true);
  });

  it('TV need input commands', () => {
    const result = devicetype.needsInputCommand('TV');
    expect(result).to.equal(true);
  });

  it('PROJECTOR need input commands', () => {
    const result = devicetype.needsInputCommand('PROJECTOR');
    expect(result).to.equal(true);
  });

  it('VOD does NOT need input commands', () => {
    const result = devicetype.needsInputCommand('VOD');
    expect(result).to.equal(false);
  });

  it('HDMISWITCH does need input commands', () => {
    const result = devicetype.needsInputCommand('HDMISWITCH');
    expect(result).to.equal(true);
  });

  it('FOO does NOT need input commands', () => {
    // @ts-ignore
    const result = devicetype.needsInputCommand('FOO');
    expect(result).to.equal(false);
  });

  it('TV does support timing', () => {
    const result = devicetype.doesNotSupportTiming('TV');
    expect(result).to.equal(false);
  });

  it('LIGHT does not support timing', () => {
    const result = devicetype.doesNotSupportTiming('LIGHT');
    expect(result).to.equal(true);
  });
});
