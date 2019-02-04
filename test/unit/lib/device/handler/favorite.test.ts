'use strict';

import { expect } from 'chai';
import * as sinon from 'sinon';
import { execute } from '../../../../../src/lib/device/handler/favorite';

describe('./lib/device/handler/button.ts', () => {
  it('should call the button function of the controller, controller returns promise', () => {
    const handler = sinon.stub().resolves();

    return execute(handler, 'deviceId', { favoriteId: '42' })
      .then((response) => {
        expect(response).to.deep.equal({ success: true });
        expect(handler.calledWith('deviceId', '42')).to.equal(true);
      });
  });
});
