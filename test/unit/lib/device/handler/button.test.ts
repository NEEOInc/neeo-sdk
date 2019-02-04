'use strict';

import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import { trigger } from '../../../../../src/lib/device/handler/button';

describe('./lib/device/handler/button.ts', () => {
  it('should call the button function of the controller, controller returns promise', (done) => {
    let buttonTriggered = false;
    function handler() {
      buttonTriggered = true;
      return BluePromise.resolve();
    }
    trigger('deviceid', handler).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      expect(buttonTriggered).to.equal(true);
      done();
    });
  });

  it('should call the button function of the controller, controller returns value', (done) => {
    function handler() {}

    trigger('deviceid', handler).then((answer) => {
      expect(answer).to.deep.equal({ success: true });
      done();
    });
  });
});
