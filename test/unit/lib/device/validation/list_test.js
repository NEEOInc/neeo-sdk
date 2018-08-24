'use strict';

const _merge = require('lodash.merge');
const expect = require('chai').expect;
const listValidation = require('../../../../../lib/device/validation/list');

describe('./lib/device/validation/list.js', function() {

  it('should validate valid title', function() {
    const input = 'foo';
    const validatedTitle = listValidation.validateTitle(input);
    expect(validatedTitle).to.equal(input);
  });

  it('should validate empty title', function() {
    const input = '';
    const validatedTitle = listValidation.validateTitle(input);
    expect(validatedTitle).to.equal(input);
  });

  it('should validate undefined title', function() {
    const validatedTitle = listValidation.validateTitle();
    expect(validatedTitle).to.equal('');
  });

  it('should validate thumbnail - positive', function() {
    // GIVEN
    const input = 'http://someimage.com/foo.jpg';

    // WHEN
    const validatedThumbnail = listValidation.validateThumbnail(input);

    // THEN
    expect(validatedThumbnail).to.equal(input);
  });

  it('should validate thumbnail - empty', function() {
    // WHEN
    expect(function() {
      listValidation.validateThumbnail();
    }).to.throw(/ERROR_LIST_THUMBNAIL_EMPTY/);
  });

  it('should validate thumbnail - not URL', function() {
    //GIVEN
    const input = 'somethingThatIsNotAURL';

    // WHEN
    expect(function() {
      listValidation.validateThumbnail(input);
    }).to.throw(/ERROR_LIST_THUMBNAIL_NO_URL/);
  });

  it('should validate item params - positive', function() {
    // GIVEN
    const input = {
      someparam: 'foo'
    };

    // WHEN
    const validatedParams = listValidation.validateItemParams(input);

    // THEN
    expect(validatedParams).to.deep.equal(input);
  });

  it('should validate item params - negative', function() {
    // WHEN
    expect(function() {
      listValidation.validateItemParams();
    }).to.throw(/ERROR_LIST_ITEM_PARAMS_EMPTY/);
  });

  it('should validate button params - positive', function() {
    // WHEN
    expect(function() {
      listValidation.validateButton({
        title: 'foo'
      });
    }).to.not.throw(/ERROR_LIST_BUTTON_TITLE_EMPTY/);
  });

  it('should validate button params - negative', function() {
    // WHEN
    expect(function() {
      listValidation.validateButton();
    }).to.throw(/ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY/);
  });

  it('should validate button row params - no object', function() {
    // WHEN
    expect(function() {
      listValidation.validateRow(true, 'buttons');
    }).to.throw(/ERROR_LIST_BUTTONS_NO_ARRAY/);
  });

  it('should validate button row params - too many buttons', function() {
    // WHEN
    expect(function() {
      listValidation.validateRow([
        { title: '1' },
        { title: '2' },
        { title: '3' },
        { title: '4' },
      ], 'buttons');
    }).to.throw(/ERROR_LIST_BUTTONS_TOO_MANY_BUTTONS/);
  });

  it('should validate button row params - object', function() {
    // WHEN
    expect(function() {
      listValidation.validateRow({}, 'buttons');
    }).to.not.throw;
  });

  it('should validate button row params - array', function() {
    // WHEN
    expect(function() {
      listValidation.validateRow([], 'buttons');
    }).to.not.throw;
  });

  it('should validate inexistent limit param', function() {
    // WHEN
    expect(function() {
      listValidation.validateLimit();
    }).to.not.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should return max limit if inexistent param', function() {
    // GIVEN
    const expectedLimit = 64;

    // WHEN
    const result = listValidation.validateLimit();
    expect(result).to.equal(expectedLimit);
  });

  it('should validate with small limit param', function() {
    // GIVEN
    const limit = 5;

    // WHEN
    expect(function() {
      listValidation.validateLimit(limit);
    }).to.not.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should return custom limit if validation is ok', function() {
    // GIVEN
    const limit = 5;

    // WHEN
    const result = listValidation.validateLimit(limit);
    expect(result).to.equal(limit);
  });

  it('should fail validation with too big limit param', function() {
    // GIVEN
    const tooLargeLimit = 500000;

    // WHEN
    expect(function() {
      listValidation.validateLimit(tooLargeLimit);
    }).to.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should fail button icon validation with not allowed icon', function() {
    // GIVEN
    const iconName = 'foo';

    // WHEN
    expect(function() {
      listValidation.validateButtonIcon(iconName);
    }).to.throw(/INVALID_ICON_NAME: foo/);
  });

  it('should not fail button icon validation without icon name', function() {
    // WHEN
    expect(function() {
      listValidation.validateButtonIcon();
    }).to.not.throw;
  });

  it('should return allowed icon after validation', function() {
    // GIVEN
    const iconName = 'repeat';

    // WHEN
    const icon = listValidation.validateButtonIcon(iconName);

    // THEN
    expect(icon).to.equal('repeat');
  });

  it('should ignore invalid icon name', function() {
    const iconName = 5;
    const icon = listValidation.validateButtonIcon(iconName);
    expect(icon).to.equal(undefined);
  });

  describe('validate full list:', function() {
    let validList;
    beforeEach(function() {
      validList = {
        browseIdentifier: 'root',
        _meta: {
          previous: { browseIdentifier: 'previous-uri', offset: 0, limit: 32 },
          current: { browseIdentifier: 'current-uri', offset: 32, limit: 32 },
          next: { browseIdentifier: 'next-uri', offset: 64, limit: 32 },
        },
        items: [{
          title: 'item-title',
          label: 'item-label',
          thumbnailUri: 'item-image-uri',
          browseIdentifier: 'current-uri',
          actionIdentifier: 'current-action-uri',
          metaData: 'current-meta-data',
        }]
      };
    });

    const tests = [
      { name: 'valid browse result' },

      { name: 'missing "_meta" property', shouldFail: true,
        data: { _meta: null }, error: /meta can\'t be blank/ },
      { name: 'missing "_meta.current" property', shouldFail: true,
        data: { _meta: { current: null } }, error: /Current can\'t be blank/ },
      { name: '"_meta.current.browseIdentifier" must be string', shouldFail: true,
        data: { _meta: { current: { browseIdentifier: 3 } } }, error: /no string/ },
      { name: '"_meta.current.browseIdentifier" can be empty', shouldFail: false,
        data: { _meta: { current: { browseIdentifier: null } } } },
      { name: '"_meta.current.offset" must be integer', shouldFail: true,
        data: { _meta: { current: { offset: null } } }, error: /no integer/ },
      { name: '"_meta.current.limit" must be integer', shouldFail: true,
        data: { _meta: { current: { limit: null } } }, error: /no integer/ },
      { name: '"_meta.previous.browseIdentifier" must be string', shouldFail: true,
        data: { _meta: { previous: { browseIdentifier: 3 } } }, error: /no string/ },
      { name: '"_meta.previous.browseIdentifier" can be empty', shouldFail: false,
        data: { _meta: { current: { browseIdentifier: undefined } } } },
      { name: '"_meta.previous.offset" must be integer', shouldFail: true,
        data: { _meta: { previous: { offset: null } } }, error: /no integer/ },
      { name: '"_meta.previous.limit" must be integer', shouldFail: true,
        data: { _meta: { previous: { limit: null } } }, error: /no integer/ },
      { name: '"_meta.next.browseIdentifier" must be string', shouldFail: true,
        data: { _meta: { next: { browseIdentifier: 3 } } }, error: /no string/ },
      { name: '"_meta.next.browseIdentifier" can be empty', shouldFail: false,
        data: { _meta: { current: { browseIdentifier: undefined } } } },
      { name: '"_meta.next.offset" must be integer', shouldFail: true,
        data: { _meta: { next: { offset: null } } }, error: /no integer/ },
      { name: '"_meta.next.limit" must be integer', shouldFail: true,
        data: { _meta: { next: { limit: null } } }, error: /no integer/ },

      { name: '"items" must be array', shouldFail: true,
        data: { items: null }, error: /no array/ },
      { name: '"items[x].title" must be string', shouldFail: true,
        data: { items: [{ title: Math.PI }], error: /no string/ } },
      { name: '"items[x].thumbnailUri" must be string', shouldFail: true,
        data: { items: [{ thumbnailUri: Math.PI }], error: /no string/ } },
      { name: '"items[x].browseIdentifier" must be string', shouldFail: true,
        data: { items: [{ browseIdentifier: Math.PI }], error: /no string/ } },
      { name: '"items[x].actionIdentifier" must be string', shouldFail: true,
        data: { items: [{ actionIdentifier: Math.PI } ], error: /no string/ } },
    ];

    tests.forEach(test => {
      it(test.name, function() {
        //GIVEN
        const testData = _merge(validList, test.data);

        //WHEN
        const fn = () => listValidation.validateList(testData);

        //THEN
        if (!test.shouldFail) {
          expect(fn).to.not.throw();
        } else {
          expect(fn).to.throw(test.error);
        }
      });
    });
  });

});
