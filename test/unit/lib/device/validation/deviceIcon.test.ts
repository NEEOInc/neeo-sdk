import { expect } from 'chai';
import * as icon from '../../../../../src/lib/device/validation/icon';

describe('./lib/device/validation/icon.ts', () => {
  it('should accept valid icon', () => {
    const result = icon.getIcon('sonos');
    expect(result).to.equal('sonos');
  });

  it('should fail to get an undefined icon', () => {
    expect(() =>
      // @ts-ignore
      icon.getIcon()
    ).to.throw(/INVALID_ICON_NAME: undefined/);
  });

  it('should fail to get a invalid icon (foo)', () => {
    expect(() => icon.getIcon('foo')).to.throw(/INVALID_ICON_NAME: foo/);
  });
});
