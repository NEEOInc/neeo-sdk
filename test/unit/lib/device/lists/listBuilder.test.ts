import { expect } from 'chai';
import ListBuilder from '../../../../../src/lib/device/lists/listBuilder';

describe('./lib/device/lists/listBuilder.ts', () => {
  describe('initialization', () => {
    it('should correctly set default values', () => {
      // WHEN
      const builder = new ListBuilder({
        title: 'title',
        browseIdentifier: 'foo',
      });

      // THEN
      expect(builder.title).to.equal('title');
      expect(builder._meta.totalItems).to.equal(0);
      expect(builder._meta.totalMatchingItems).to.equal(0);
    });

    it('should fail to initialize with too big limit (64 max)', () => {
      // WHEN
      expect(
        () =>
          new ListBuilder({
            title: 'Foo',
            limit: 50000,
          })
      ).to.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
    });

    it('should initialize simple list', () => {
      const result = new ListBuilder();
      expect(result.title).to.equal('');
    });
  });

  it('should build correct metadata for empty list', () => {
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
      totalMatchingItems: 30,
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

  it('should build correct metadata for list with real items', () => {
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
      thumbnailUri: 'http://example.com/someimage.png',
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
      totalMatchingItems: 500,
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

  it('should build correct metadata for list with real items - second page', () => {
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
      thumbnailUri: 'http://example.com/someimage.png',
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
      totalMatchingItems: 500,
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

  it('should set list title', () => {
    const title = 'CUSTOM TITLE';
    const result = new ListBuilder();
    result.setListTitle(title);
    expect(result.title).to.equal(title);
  });

  describe('adding elements', () => {
    let listBuilder;

    beforeEach(() => {
      listBuilder = new ListBuilder({
        title: 'title',
        browseIdentifier: 'foo',
      });
    });

    it('should add list item', () => {
      // GIVEN
      const params = {
        title: 'foo',
        thumbnailUri: 'http://example.com/someimage.png',
        actionIdentifier: 'someaction',
      };

      // WHEN
      listBuilder.addListItem(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should add list items', () => {
      // GIVEN
      const params = {
        title: 'foo',
        thumbnailUri: 'http://example.com/someimage.png',
        actionIdentifier: 'someaction',
      };

      // WHEN
      listBuilder.addListItems([params]);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    function _buildListItems(arrayLength) {
      const params = {
        thumbnailUri: 'http://example.com/someimage.png',
        actionIdentifier: 'someaction',
      };
      const listData = new Array(arrayLength).fill(1).map((unused, index) => {
        const title = 'foo ' + index;
        return Object.assign({ title }, params);
      });
      return listData;
    }

    it('should respect maximal items when using addListItems, list initially empty', () => {
      // GIVEN
      const arrayLength = 100;
      const listData = _buildListItems(arrayLength);

      // WHEN
      listBuilder.addListItems(listData).setTotalMatchingItems(arrayLength);

      // THEN
      expect(listBuilder.items.length).to.equal(listBuilder.limit);
      expect(listBuilder.totalMatchingItems).to.equal(arrayLength);
      expect(listBuilder.items[0].title).to.equal('foo 0');
      expect(listBuilder._meta.next).to.deep.equal({
        offset: 64,
        limit: listBuilder.limit,
        browseIdentifier: 'foo',
      });
    });

    it('should respect maximal items when using addListItems, list initially NOT empty', () => {
      // GIVEN
      const arrayLength = 100;
      const listData = _buildListItems(arrayLength);
      const params = {
        title: 'foo',
        thumbnailUri: 'http://example.com/someimage.png',
        actionIdentifier: 'someaction',
      };

      // WHEN
      listBuilder
        .addListItem(params)
        .addListItems(listData)
        .setTotalMatchingItems(arrayLength + 1);

      // THEN
      expect(listBuilder.items.length).to.equal(64);
      expect(listBuilder.totalMatchingItems).to.equal(arrayLength + 1);
      expect(listBuilder.items[1].title).to.equal('foo 0');
    });

    it('should respect maximal items when using addListItems, overflow', () => {
      // GIVEN
      const arrayLength = 100;
      const listData = _buildListItems(arrayLength);

      // WHEN
      listBuilder
        .addListItems(listData)
        .addListItems(listData)
        .setTotalMatchingItems(arrayLength * 2);

      // THEN
      expect(listBuilder.items.length).to.equal(64);
      expect(listBuilder.totalMatchingItems).to.equal(arrayLength * 2);
      expect(listBuilder.items[0].title).to.equal('foo 0');
    });

    it('should fail to add list item without params', () => {
      // WHEN
      expect(() => {
        listBuilder.addListItem();
      }).to.throw(/ERROR_LIST_ITEM_PARAMS_EMPTY/);
      expect(listBuilder.items.length).to.equal(0);
    });

    it('should add list header', () => {
      // GIVEN
      const title = 'headertitle';

      // WHEN
      listBuilder.addListHeader(title);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should add empty list header without params', () => {
      listBuilder.addListHeader();
      expect(listBuilder.items.length).to.equal(1);
      expect(listBuilder.items[0]).to.deep.equal({ isHeader: true, title: '' });
    });

    it('should add list tile', () => {
      // GIVEN
      const params = [
        {
          thumbnailUri: 'http://www.image.com/image.jpg',
        },
      ];

      // WHEN
      listBuilder.addListTiles(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
    });

    it('should fail to add list tile without thumbnail param', () => {
      // WHEN
      expect(() => {
        listBuilder.addListTiles([{ actionIdentifier: 'foo' }]);
      }).to.throw(/ERROR_LIST_THUMBNAIL_EMPTY/);
    });

    it('should add list info item', () => {
      // GIVEN
      const params = {
        title: 'foo',
        thumbnailUri: 'http://example.com/someimage.jpg',
        actionIdentifier: 'someaction',
      };

      // WHEN
      listBuilder.addListInfoItem(params);

      // THEN
      expect(listBuilder.items.length).to.equal(1);
      expect(listBuilder.items[0].isInfoItem).to.equal(true);
    });

    it('should fail to add list info item without title', () => {
      listBuilder.addListInfoItem({});
      expect(listBuilder.items.length).to.equal(1);
      expect(listBuilder.items[0].isInfoItem).to.equal(true);
      expect(listBuilder.items[0].title).to.equal('');
    });

    it('should add list button', () => {
      // GIVEN
      const params = [
        {
          title: 'some title',
          actionIdentifier: 'action!',
        },
      ];

      // WHEN
      listBuilder.addListButtons(params);

      // THEN
      expect(listBuilder.items[0].buttons[0].isButton).to.equal(true);
      expect(listBuilder.items[0].buttons[0].title).to.equal(params[0].title);
      expect(listBuilder.items[0].buttons[0].actionIdentifier).to.equal(params[0].actionIdentifier);
    });

    it('should add two list buttons', () => {
      // GIVEN
      const buttons = [
        {
          title: 'some title',
          actionIdentifier: 'action!',
        },
        {
          title: 'some other',
          actionIdentifier: 'action2!',
        },
      ];

      // WHEN
      listBuilder.addListButtons(buttons);

      // THEN
      expect(listBuilder.items[0].buttons.length).to.equal(2);
      expect(listBuilder.items[0].buttons[0].isButton).to.equal(true);
      expect(listBuilder.items[0].buttons[1].isButton).to.equal(true);
    });

    it('should fail to add list button without title and icon param', () => {
      // WHEN
      expect(() => listBuilder.addListButtons([{ actionIdentifier: 'foo' }])).to.throw(
        /ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY/
      );
    });
  });
});
