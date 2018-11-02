import { expect } from 'chai';
import * as buttonGroup from '../../../../../src/lib/device/validation/buttonGroup';

describe('./lib/device/validation/buttongroup.ts', () => {
  it('should try to get non existent button group (undefined)', () => {
    const result = buttonGroup.get();
    expect(result).to.equal(undefined);
  });

  it('should try to get non existent button group', () => {
    const result = buttonGroup.get('foo');
    expect(result).to.equal(undefined);
  });

  it('should get Volume button group', () => {
    const result = buttonGroup.get('Volume');
    expect(result.length).to.equal(3);
    expect(result).to.deep.equal(['VOLUME UP', 'VOLUME DOWN', 'MUTE TOGGLE']);
  });

  it('should get Volume button group, lower case', () => {
    const result = buttonGroup.get('volume');
    expect(result.length).to.equal(3);
  });

  it('should get Volume button group, mixed case', () => {
    const result = buttonGroup.get('VolUME');
    expect(result.length).to.equal(3);
  });

  it('should get Numpad button group', () => {
    const result = buttonGroup.get('Numpad');
    expect(result.length).to.equal(10);
    expect(result).to.deep.equal([
      'DIGIT 0',
      'DIGIT 1',
      'DIGIT 2',
      'DIGIT 3',
      'DIGIT 4',
      'DIGIT 5',
      'DIGIT 6',
      'DIGIT 7',
      'DIGIT 8',
      'DIGIT 9',
    ]);
  });
});
