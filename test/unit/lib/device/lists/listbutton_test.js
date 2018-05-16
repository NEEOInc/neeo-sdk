'use strict';

const expect = require('chai').expect;
const ListButton = require('../../../../../lib/device/lists/listButton');

describe('./lib/device/lists/listButton.js', function() {

  it('should correctly set properties', function() {
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

  it('should throw if there is no title', function() {
    // WHEN
    expect(() => {
      new ListButton({});
    }).to.throw(/ERROR_LIST_BUTTON_TITLE_EMPTY/);
  });

});
