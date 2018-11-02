import { expect } from 'chai';
import * as factory from '../../../../src/lib/recipe/factory';

describe('./lib/recipe/factory.ts', () => {
  it('should not fail when call factory without parameter', () => {
    // @ts-ignore
    const result = factory.buildRecipesModel();
    expect(result).to.deep.equal([]);
  });

  it('should filter invalid entries', () => {
    // @ts-ignore
    const result = factory.buildRecipesModel([{ foo: 'bar' }]);
    expect(result).to.deep.equal([]);
  });

  it('should build recipe', () => {
    const result = factory.buildRecipesModel([
      {
        type: 'launch',
        detail: {
          devicename: 'TV',
          roomname: 'Living%20Room',
          model: 'LHD32V78HUS%20(HOTEL%20TV)',
          manufacturer: 'Hisense',
          devicetype: 'TV',
        },
        url: {
          identify: 'http://127.0.0.1:3000/v1/systeminfo/identbrain',
          setPowerOn:
            'http://127.0.0.1:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602382016512/execute',
          setPowerOff:
            'http://127.0.0.1:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602394599424/execute',
          getPowerState:
            'http://127.0.0.1:3000/v1/projects/home/rooms/6213841889238450176/recipes/6223454602382016512/isactive',
        },
        isCustom: false,
        isPoweredOn: false,
        uid: '6223454581767012352',
        powerKey: '6223454602377822208',
      },
    ]);
    expect(result.length).to.equal(1);
    expect(typeof result[0].action.identify).to.equal('function');
    expect(typeof result[0].action.powerOn).to.equal('function');
    expect(typeof result[0].action.getPowerState).to.equal('function');
    expect(typeof result[0].action.powerOff).to.equal('function');
  });

  it('should validate active recipe answer, undefined parameter', () => {
    // @ts-ignore
    const result = factory.validateActiveRecipesAnswer();
    expect(result).to.equal(false);
  });

  it('should validate active recipe answer, json data', () => {
    // @ts-ignore
    const result = factory.validateActiveRecipesAnswer({ foo: 'bar' });
    expect(result).to.equal(false);
  });

  it('should validate active recipe answer, array', () => {
    const result = factory.validateActiveRecipesAnswer([1, 2, 3]);
    expect(result).to.equal(true);
  });
});
