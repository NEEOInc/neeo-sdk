import { expect } from 'chai';
import * as IpHelper from '../../../../../src/lib/device/validation/ipHelper';

describe('./lib/device/validation/iphelper.ts', () => {
  it('should get any ip', () => {
    const result = IpHelper.getAnyIpAddress();
    expect(result !== undefined).to.equal(true);
    expect(result.length > 3).to.equal(true);
  });
});
