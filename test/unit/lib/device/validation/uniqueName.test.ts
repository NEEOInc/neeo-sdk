import { expect } from 'chai';
import uniqueName from '../../../../../src/lib/device/validation/uniqueName';

describe('./lib/device/validation/uniqueName', () => {
  it('should create the same name twice', () => {
    const name1 = uniqueName('foo');
    const name2 = uniqueName('foo');
    expect(name1).to.equal(name2);
  });

  it('should not create the same name from a different input', () => {
    const name1 = uniqueName('1');
    const name2 = uniqueName('2');
    expect(name1).to.not.equal(name2);
  });

  it('should create the same name twice, custom unique string', () => {
    const name1 = uniqueName('foo', 'la');
    const name2 = uniqueName('foo', 'la');
    const name3 = uniqueName('foo', 'lb');
    expect(name1).to.equal(name2);
    expect(name1).to.not.equal(name3);
  });
});
