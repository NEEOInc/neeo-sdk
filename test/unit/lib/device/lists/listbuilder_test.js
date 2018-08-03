'use strict';

const expect = require('chai').expect;
const ListBuilder = require('../../../../../lib/device/lists/listBuilder');

describe('./lib/device/lists/listBuilder.js', function () {

  describe('initialization', function () {
    it('should correctly set default values', function () {
      // WHEN
      const builder = new ListBuilder({
        title: 'title',
        browseIdentifier: 'foo',
      });

      // THEN
      expect(builder.title).to.equal('title');
      expect(builder.limit).to.equal(64);
      expect(builder.offset).to.equal(0);
      expect(builder._meta.totalItems).to.equal(0);
      expect(builder._meta.totalMatchingItems).to.equal(0);
    });

    it('should fail to initialize with too big limit (64 max)', function () {
      // WHEN
      expect(() => {
        new ListBuilder({
          title: 'Foo',
          limit: 50000
        });
      }).to.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
    });

    it('should fail to initialize without title', function () {
      // WHEN
      expect(() => {
        new ListBuilder({});
      }).to.throw(/ERROR_LIST_TITLE_EMPTY/);
    });

    it('should fail to initialize without params', function () {
      // WHEN
      expect(() => {
        new ListBuilder();
      }).to.throw(/ERROR_LIST_NO_OPTIONS_PROVIDED/);
    });
  });

  it('should build correct metadata for empty list', function () {
    // GIVEN
    const expectedMetaData = {
      current: {
        limit: 10,
        offset: 0,
        browseIdentifier: 'ident',
      },
      next: {
        limit: 10,
        offset: 0, // we didn't add any items therefore we still have the same offset
        browseIdentifier: 'ident',
      },
      totalItems: 0,
      totalMatchingItems: 30
    };

    // WHEN
    const listBuilder = new ListBuilder({
      title: 'title',
      totalMatchingItems: 30,
      offset: 0,
      limit: 10,
      browseIdentifier: 'ident',
    });

    // THEN
    expect(listBuilder._meta).to.deep.equal(expectedMetaData);
  });

  it('should build correct metadata for list with real items', function () {
    // GIVEN
    const listBuilder = new ListBuilder({
      title: 'title',
      totalMatchingItems: 500,
      offset: 0,
      limit: 5,
      browseIdentifier: 'ident',
    });

    const listParams = {
      title: 'foo',
      thumbnailUri: 'someimage',
      actionIdentifier: 'someaction',
    };

    const expectedMetaData = {
      current: {
        limit: 5,
        offset: 0,
        browseIdentifier: 'ident',
      },
      next: {
        limit: 5,
        offset: 5,
        browseIdentifier: 'ident',
      },
      totalItems: 5,
      totalMatchingItems: 500
    };

    // WHEN
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);

    // THEN
    expect(listBuilder._meta).to.deep.equal(expectedMetaData);
  });

  it('should build correct metadata for list with real items - second page', function () {
    // GIVEN
    const listBuilder = new ListBuilder({
      title: 'title',
      totalMatchingItems: 500,
      offset: 5,
      limit: 5,
      browseIdentifier: 'ident',
    });

    const listParams = {
      title: 'foo',
      thumbnailUri: 'someimage',
      actionIdentifier: 'someaction',
    };

    const expectedMetaData = {
      current: {
        limit: 5,
        offset: 5,
        browseIdentifier: 'ident',
      },
      next: {
        limit: 5,
        offset: 10,
        browseIdentifier: 'ident',
      },
      previous: {
        limit: 5,
        offset: 0,
        browseIdentifier: 'ident',
      },
      totalItems: 5,
      totalMatchingItems: 500
    };

    // WHEN
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);
    listBuilder.addListItem(listParams);

    // THEN
    expect(listBuilder._meta).to.deep.equal(expectedMetaData);
  });

  describe('adding elements', function () {
    let listBuilder;

    beforeEach(function () {
      listBuilder = new ListBuilder({
        title: 'title',
        browseIdentifier: 'foo',
      });
    });

    it('should add list item', function () {
      // GIVEN
      const params = {
        title: 'foo',
        thumbnailUri: 'someimage',
        actionIdentifier: 'someaction',
      };

      // WHEN
      listBuilder.addListItem(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should fail to add list item without params', function () {
      // WHEN
      expect(() => {
        listBuilder.addListItem();
      }).to.throw(/ERROR_LIST_ITEM_PARAMS_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });

    it('should add list header', function () {
      // GIVEN
      const title = 'headertitle';

      // WHEN
      listBuilder.addListHeader(title);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should fail to add list header without params', function () {
      // WHEN
      expect(() => {
        listBuilder.addListHeader();
      }).to.throw(/ERROR_LIST_TITLE_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });

    it('should add list tile', function () {
      // GIVEN
      const params = [{
        thumbnailUri: 'http://www.image.com/image.jpg'
      }];

      // WHEN
      listBuilder.addListTiles(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should fail to add list tile without thumbnail param', function () {
      // WHEN
      expect(() => {
        listBuilder.addListTiles([{ actionIdentifier: 'foo' }]);
      }).to.throw(/ERROR_LIST_THUMBNAIL_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });

    it('should add list info item', function () {
      // GIVEN
      const params = {
        title: 'foo',
        thumbnailUri: 'someimage',
        actionIdentifier: 'someaction'
      };

      // WHEN
      listBuilder.addListInfoItem(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
      expect(listBuilder.items[0].isInfoItem).to.equal(true);
    });

    it('should fail to add list info item without title', function () {
      // GIVEN
      const params = {};

      // WHEN
      expect(() => {
        listBuilder.addListInfoItem(params);
      }).to.throw(/ERROR_LIST_TITLE_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });

    it('should add list button', function () {
      // GIVEN
      const params = [{
        title: 'some title',
        actionIdentifier: 'action!',
      }];

      // WHEN
      listBuilder.addListButtons(params);

      // THEN
      expect(listBuilder.items[0].buttons[0].isButton).to.equal(true);
      expect(listBuilder.items[0].buttons[0].title).to.equal(params[0].title);
      expect(listBuilder.items[0].buttons[0].actionIdentifier).to.equal(params[0].actionIdentifier);
    });

    it('should add two list buttons', function () {
      // GIVEN
      const buttons = [{
        title: 'some title',
        actionIdentifier: 'action!',
      }, {
        title: 'some other',
        actionIdentifier: 'action2!',
      }];

      // WHEN
      listBuilder.addListButtons(buttons);

      // THEN
      expect(listBuilder.items[0].buttons.length).to.equal(2);
      expect(listBuilder.items[0].buttons[0].isButton).to.equal(true);
      expect(listBuilder.items[0].buttons[1].isButton).to.equal(true);
    });

    it('should fail to add list button without title param', function () {
      // WHEN
      expect(() => {
        listBuilder.addListButtons([{ actionIdentifier: 'foo' }]);
      }).to.throw(/ERROR_LIST_BUTTON_TITLE_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });
  });

});
