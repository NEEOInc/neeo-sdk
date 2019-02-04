'use strict';

import { expect } from 'chai';
import { ListTile } from '../../../../../src/lib/device/lists/listTile';
import { ListUIAction } from '../../../../../src/lib/models';

describe('./lib/device/lists/listTile.ts', () => {
  it('should correctly set properties', () => {
    const params = {
      thumbnailUri: 'http://www.image.com/image.jpg',
      actionIdentifier: 'action',
      uiAction: 'close' as ListUIAction,
      isQueueable: true,
    };
    const expected = Object.assign({}, params, {
      isTile: true,
    });

    const listTile = new ListTile(params);

    expect(listTile).to.deep.equal(expected);
  });
});
