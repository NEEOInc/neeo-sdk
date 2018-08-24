'use strict';

const expect = require('chai').expect;
const ListButton = require('../../../../../lib/device/lists/listButton');

describe('./lib/device/lists/listButton.js', function() {

  it('should correctly set properties with title', function() {
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

  it('should correctly set properties with icon', function() {
    // GIVEN
    const params = {
      iconName: 'repeat',
      actionIdentifier: 'action',
    };

    // WHEN
    const listButton = new ListButton(params);

    // THEN
    expect(listButton.iconName).to.equal(params.iconName);
    expect(listButton.actionIdentifier).to.equal(params.actionIdentifier);
  });

  it('should correctly set properties with inverse', function() {
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

  it('should throw if there is no title or icon', function() {
    // WHEN
    expect(() => {
      new ListButton({});
    }).to.throw(/ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY/);
  });

  it('should not throw if there is no title but an icon', function() {
    // WHEN
    expect(() => {
      new ListButton({ iconName: 'sonos' });
    }).to.not.throw;
  });

  it('should not throw if there is no icon but a title', function() {
    // WHEN
    expect(() => {
      new ListButton({ title: 'foo' });
    }).to.not.throw;
  });

});
