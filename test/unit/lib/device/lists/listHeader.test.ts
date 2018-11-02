'use strict';

import { expect } from 'chai';
import { ListHeader } from '../../../../../src/lib/device/lists/listHeader';

describe('./lib/device/lists/listHeader.ts', () => {
  it('should correctly set label', () => {
    // WHEN
    const listHeader = new ListHeader('title');

    // THEN
    expect(listHeader.title).to.equal('title');
  });

  it('should correctly set isHeader flag', () => {
    // WHEN
    const listHeader = new ListHeader('title');

    // THEN
    expect(listHeader.isHeader).to.equal(true);
  });
});
