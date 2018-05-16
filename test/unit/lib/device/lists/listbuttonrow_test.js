'use strict';

const expect = require('chai').expect;
const ListButtonRow = require('../../../../../lib/device/lists/listButtonRow');

describe('./lib/device/lists/listButtonRow.js', function() {

  it('should correctly build row with one button - as object', function() {
    // GIVEN
    const buttonDefinition = [{
      title: 'foo',
      actionIdentifier: 'action',
    }];
    const listButtonRow = new ListButtonRow(buttonDefinition);

    // WHEN
    const buttonsItem = listButtonRow.getButtons();

    // THEN
    expect(buttonsItem.buttons.length).to.equal(1);
    expect(buttonsItem.buttons[0].title).to.equal(buttonDefinition[0].title);
    expect(buttonsItem.buttons[0].actionIdentifier).to.equal(buttonDefinition[0].actionIdentifier);
  });

  it('should build buttons from array - one', function() {
    // GIVEN
    const buttonDefinition = [{
      title: 'foo',
      actionIdentifier: 'action',
    }];
    const listButtonRow = new ListButtonRow(buttonDefinition);

    // WHEN
    const buttonsItem = listButtonRow.getButtons();

    // THEN
    expect(buttonsItem.buttons.length).to.equal(1);
    expect(buttonsItem.buttons[0].title).to.equal(buttonDefinition[0].title);
    expect(buttonsItem.buttons[0].actionIdentifier).to.equal(buttonDefinition[0].actionIdentifier);
  });

  it('should build buttons from array - two', function() {
    // GIVEN
    const buttonDefinition = [{
      title: 'foo',
      actionIdentifier: 'action',
    }, {
      title: 'foo2',
      actionIdentifier: 'action2',
    }];
    const listButtonRow = new ListButtonRow(buttonDefinition);

    // WHEN
    const buttonItem = listButtonRow.getButtons();

    // THEN
    expect(buttonItem.buttons.length).to.equal(2);
    expect(buttonItem.buttons[0].title).to.equal(buttonDefinition[0].title);
    expect(buttonItem.buttons[1].title).to.equal(buttonDefinition[1].title);
  });

  it('should build buttons from array - three', function() {
    // GIVEN
    const buttonDefinition = [{
      title: 'foo',
      actionIdentifier: 'action',
    }, {
      title: 'foo2',
      actionIdentifier: 'action2',
    }, {
      title: 'foo3',
      actionIdentifier: 'action3',
    }];
    const listButtonRow = new ListButtonRow(buttonDefinition);

    // WHEN
    const buttonItem = listButtonRow.getButtons();

    // THEN
    expect(buttonItem.buttons.length).to.equal(3);
    expect(buttonItem.buttons[0].title).to.equal(buttonDefinition[0].title);
    expect(buttonItem.buttons[1].title).to.equal(buttonDefinition[1].title);
    expect(buttonItem.buttons[2].title).to.equal(buttonDefinition[2].title);
  });

  it('should not build buttons for missing definition', function() {
    expect(() => {
      new ListButtonRow();
    }).to.throw(/ERROR_LIST_BUTTONS_NO_ARRAY/);
  });

});
