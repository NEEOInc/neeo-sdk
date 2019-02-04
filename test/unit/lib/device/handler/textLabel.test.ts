import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as Textlabel from '../../../../../src/lib/device/handler/textLabel';

describe('./lib/device/handler/textLabel.ts', () => {
  it('should call the getText function of the controller, controller returns promise', (done) => {
    const value = 'bar';
    let getTextTriggered = false;
    function handler() {
      getTextTriggered = true;
      return BluePromise.resolve(value);
    }

    Textlabel.getText(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(getTextTriggered).to.equal(true);
      done();
    });
  });

  it('should call the getText function of the controller, controller returns value', (done) => {
    const value = 'foo';
    let getTextTriggered = false;
    function handler() {
      getTextTriggered = true;
      return value;
    }
    Textlabel.getText(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(getTextTriggered).to.equal(true);
      done();
    });
  });
});
