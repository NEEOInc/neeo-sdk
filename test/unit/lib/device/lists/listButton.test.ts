'use strict';

import { expect } from 'chai';
import { ListButton } from '../../../../../src/lib/device/lists/listButton';

describe('./lib/device/lists/listButton.ts', () => {
  it('should correctly set properties with title', () => {
    // GIVEN
    const params = {
      title: 'foo',
      actionIdentifier: 'action',
    };

    // WHEN
    const listButton = new ListButton(params);

    // THEN
    expect(listButton.title).to.equal(params.title);
    expect(listButton.actionIdentifier).to.equal(params.actionIdentifier);
  });

  it('should correctly set properties with icon', () => {
    // GIVEN
    const params = {
      iconName: 'repeat' as 'repeat',
      actionIdentifier: 'action',
    };

    // WHEN
    const listButton = new ListButton(params);

    // THEN
    expect(listButton.iconName).to.equal(params.iconName);
    expect(listButton.actionIdentifier).to.equal(params.actionIdentifier);
  });

  it('should correctly set properties with inverse', () => {
    // GIVEN
    const params = {
      title: 'foo',
      inverse: true,
      actionIdentifier: 'action',
    };

    // WHEN
    const listButton = new ListButton(params);

    // THEN
    expect(listButton.inverse).to.equal(params.inverse);
    expect(listButton.actionIdentifier).to.equal(params.actionIdentifier);
  });
});
