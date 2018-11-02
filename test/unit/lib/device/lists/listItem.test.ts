'use strict';

import { expect } from 'chai';
import { ListItem } from '../../../../../src/lib/device/lists/listItem';
import { ListUIAction } from '../../../../../src/lib/models';

describe('./lib/device/lists/listItem.ts', () => {
  it('should correctly set properties', () => {
    const params = {
      title: 'sometitle',
      label: 'label',
      thumbnailUri: 'someURI',
      browseIdentifier: 'browse',
      actionIdentifier: 'action',
      uiAction: 'close' as ListUIAction,
      isQueueable: true,
    };

    const listItem = new ListItem(params);

    expect(listItem).to.deep.equal(params);
  });

  it('should throw if there is no title', () => {
    // @ts-ignore
    const result = new ListItem();
    expect(result.title).to.deep.equal('');
  });
});
