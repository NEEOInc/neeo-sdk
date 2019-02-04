'use strict';

import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as ImageUrl from '../../../../../src/lib/device/handler/imageUrl';

describe('./lib/device/handler/imageurl.ts', () => {
  it('should call the getImageUri function of the controller, controller returns promise', () => {
    const value = 'bar';
    let getImageUriTriggered = false;
    function handler() {
      getImageUriTriggered = true;
      return BluePromise.resolve(value);
    }
    return ImageUrl.getImageUri(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(getImageUriTriggered).to.equal(true);
    });
  });

  it('should call the getImageUri function of the controller, controller returns value', () => {
    const value = 'foo';
    let getImageUriTriggered = false;
    function handler() {
      getImageUriTriggered = true;
      return value;
    }
    return ImageUrl.getImageUri(handler, '').then((answer) => {
      expect(answer).to.deep.equal({ value });
      expect(getImageUriTriggered).to.deep.equal(true);
    });
  });
});
