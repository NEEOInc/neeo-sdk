'use strict';

const expect = require('chai').expect;
const ListInfoItem = require('../../../../../lib/device/lists/listInfoItem');

describe('./lib/device/lists/listInfoItem.js', function() {

  it('should correctly set info item properties', function() {
    // GIVEN
    const params = {
      title: 'title',
      text: 'some text',
      affirmativeButtonText: 'OK',
      negativeButtonText: 'Cancel',
      actionIdentifier: 'ACTION!',
    };

    // WHEN
    const listHeader = new ListInfoItem(params);

    // THEN
    expect(listHeader.title).to.equal(params.title);
    expect(listHeader.text).to.equal(params.text);
    expect(listHeader.affirmativeButtonText).to.equal(params.affirmativeButtonText);
    expect(listHeader.negativeButtonText).to.equal(params.negativeButtonText);
    expect(listHeader.actionIdentifier).to.equal(params.actionIdentifier);
  });

  it('should correctly set isInfoItem flag', function() {
    // WHEN
    const listHeader = new ListInfoItem({ title: 'title' });

    // THEN
    expect(listHeader.isInfoItem).to.equal(true);
  });

});
