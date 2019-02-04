import { expect } from 'chai';
import buildBrainUrl from '../../../../../src/lib/device/brain/urlBuilder';

const BASE_URL_GETRECIPES = '/v1/api/recipes';

describe('./lib/device/brain/urlbuilder.ts', () => {
  it('should return brain url when object is provided', () => {
    // @ts-ignore
    const test = buildBrainUrl({ host: 'test.local', port: 6336 });
    expect(test).to.equal('http://test.local:6336');
  });

  it('should return brain url when string is provided', () => {
    const test = buildBrainUrl('brain.local');
    expect(test).to.equal('http://brain.local:3000');
  });

  it('should return brain url when string is provided and port is defined', () => {
    const test = buildBrainUrl('brain.local', undefined, 2323);
    expect(test).to.equal('http://brain.local:2323');
  });

  it('should return brain url and path when object is provided with uri', () => {
    const test = buildBrainUrl(
      // @ts-ignore
      { host: 'test.local', port: 6336 },
      BASE_URL_GETRECIPES
    );
    expect(test).to.equal('http://test.local:6336/v1/api/recipes');
  });

  it('should return brain url and path when string is provided with uri', () => {
    const test = buildBrainUrl('brain.local', BASE_URL_GETRECIPES);
    expect(test).to.equal('http://brain.local:3000/v1/api/recipes');
  });

  it('should fail to create url, with missing parameter', () => {
    expect(() => {
      // @ts-ignore
      buildBrainUrl();
    }).to.throw(/URLBUILDER_MISSING_PARAMETER_BRAIN/);
  });

  it('should fail to create url, with invalid parameter', () => {
    expect(() => {
      // @ts-ignore
      buildBrainUrl(6336);
    }).to.throw(/URLBUILDER_INVALID_PARAMETER_BRAIN/);
  });
});
