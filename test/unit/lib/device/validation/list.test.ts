import { expect } from 'chai';
import { merge as _merge } from 'lodash';
import * as listValidation from '../../../../../src/lib/device/validation/list';

describe('./lib/device/validation/list.ts', () => {
  it('should validate thumbnail - positive', () => {
    // GIVEN
    const input = 'http://someimage.com/foo.jpg';

    // WHEN
    expect(() => {
      listValidation.validateThumbnail(input);
    }).to.not.throw;
  });

  it('should validate thumbnail - empty', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateThumbnail();
    }).to.throw(/ERROR_LIST_THUMBNAIL_EMPTY/);
  });

  it('should validate thumbnail - not URL', () => {
    // GIVEN
    const input = 'somethingThatIsNotAURL';

    // WHEN
    expect(() => {
      listValidation.validateThumbnail(input);
    }).to.throw(/ERROR_LIST_THUMBNAIL_NO_URL/);
  });

  it('should validate item params - positive', () => {
    // GIVEN
    const input = {
      someparam: 'foo',
    };

    // WHEN
    const validatedParams = listValidation.validateItemParams(input);

    // THEN
    expect(validatedParams).to.deep.equal(input);
  });

  it('should validate item params - negative', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateItemParams();
    }).to.throw(/ERROR_LIST_ITEM_PARAMS_EMPTY/);
  });

  it('should validate button params - positive', () => {
    // WHEN
    expect(() => {
      listValidation.validateButton({
        title: 'foo',
      });
    }).to.not.throw(/ERROR_LIST_BUTTON_TITLE_EMPTY/);
  });

  it('should validate button params - negative', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateButton();
    }).to.throw(/ERROR_LIST_BUTTON_TITLE_OR_ICON_EMPTY/);
  });

  it('should validate button row params - no object', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateRow(true, 'buttons');
    }).to.throw(/ERROR_LIST_BUTTONS_NO_ARRAY/);
  });

  it('should validate button row params - too many buttons', () => {
    // WHEN
    expect(() => {
      listValidation.validateRow(
        [{ title: '1' }, { title: '2' }, { title: '3' }, { title: '4' }],
        'buttons'
      );
    }).to.throw(/ERROR_LIST_BUTTONS_TOO_MANY_BUTTONS/);
  });

  it('should validate button row params - object', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateRow({}, 'buttons');
    }).to.not.throw;
  });

  it('should validate button row params - array', () => {
    // WHEN
    expect(() => {
      listValidation.validateRow([], 'buttons');
    }).to.not.throw;
  });

  it('should validate inexistent limit param', () => {
    // WHEN
    expect(() => {
      listValidation.validateLimit();
    }).to.not.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should return max limit if inexistent param', () => {
    // GIVEN
    const expectedLimit = 64;

    // WHEN
    const result = listValidation.validateLimit();
    expect(result).to.equal(expectedLimit);
  });

  it('should validate with small limit param', () => {
    // GIVEN
    const limit = 5;

    // WHEN
    expect(() => {
      listValidation.validateLimit(limit);
    }).to.not.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should return custom limit if validation is ok', () => {
    // GIVEN
    const limit = 5;

    // WHEN
    const result = listValidation.validateLimit(limit);
    expect(result).to.equal(limit);
  });

  it('should fail validation with too big limit param', () => {
    // GIVEN
    const tooLargeLimit = 500000;

    // WHEN
    expect(() => {
      listValidation.validateLimit(tooLargeLimit);
    }).to.throw(/ERROR_LIST_LIMIT_MAXIMUM_EXCEEDED/);
  });

  it('should fail button icon validation with not allowed icon', () => {
    // GIVEN
    const iconName = 'foo';

    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateButtonIcon(iconName);
    }).to.throw(/INVALID_ICON_NAME: foo/);
  });

  it('should not fail button icon validation without icon name', () => {
    // WHEN
    expect(() => {
      // @ts-ignore
      listValidation.validateButtonIcon();
    }).to.not.throw;
  });

  it('should return allowed icon after validation', () => {
    // GIVEN
    const iconName = 'repeat';

    // WHEN
    const icon = listValidation.validateButtonIcon(iconName);

    // THEN
    expect(icon).to.equal('repeat');
  });

  it('should ignore invalid icon name', () => {
    const iconName = 5;
    // @ts-ignore
    const icon = listValidation.validateButtonIcon(iconName);
    expect(icon).to.equal(undefined);
  });

  it('should return action after action validation', () => {
    // GIVEN
    const actionName = 'close';

    // WHEN
    const action = listValidation.validateUIAction(actionName);
    expect(action).to.equal(actionName);
  });

  it('should return action after action validation - UPPERCASE', () => {
    // GIVEN
    const actionName = 'close';

    // WHEN
    const action = listValidation.validateUIAction(actionName);
    expect(action).to.equal(actionName);
  });

  it('should return undefined action after action validation - undefined', () => {
    // GIVEN
    const actionName = undefined;

    // WHEN
    const action = listValidation.validateUIAction(actionName);
    expect(action).to.equal(undefined);
  });

  describe('validate full list:', () => {
    let validList;
    beforeEach(() => {
      validList = {
        browseIdentifier: 'root',
        _meta: {
          previous: { browseIdentifier: 'previous-uri', offset: 0, limit: 32 },
          current: { browseIdentifier: 'current-uri', offset: 32, limit: 32 },
          next: { browseIdentifier: 'next-uri', offset: 64, limit: 32 },
        },
        items: [
          {
            title: 'item-title',
            label: 'item-label',
            thumbnailUri: 'http://example.com/item-image-uri.png',
            browseIdentifier: 'current-uri',
            actionIdentifier: 'current-action-uri',
            uiAction: 'close',
            metaData: 'current-meta-data',
          },
        ],
      };
    });

    const tests = [
      { name: 'valid browse result' },

      {
        name: 'missing "_meta" property',
        shouldFail: true,
        data: { _meta: null },
        error: /property "_meta" not present/,
      },
      {
        name: 'missing "_meta.current" property',
        shouldFail: true,
        data: { _meta: { current: null } },
        error: /property "current" not present/,
      },
      {
        name: '"_meta.current.browseIdentifier" must be string',
        shouldFail: true,
        data: { _meta: { current: { browseIdentifier: 3 } } },
        error: /no string/,
      },
      {
        name: '"_meta.current.browseIdentifier" can be empty',
        shouldFail: false,
        data: { _meta: { current: { browseIdentifier: null } } },
      },
      {
        name: '"_meta.current.offset" must be integer',
        shouldFail: true,
        data: { _meta: { current: { offset: null } } },
        error: /no integer/,
      },
      {
        name: '"_meta.current.limit" must be integer',
        shouldFail: true,
        data: { _meta: { current: { limit: null } } },
        error: /no integer/,
      },
      {
        name: '"_meta.previous.browseIdentifier" must be string',
        shouldFail: true,
        data: { _meta: { previous: { browseIdentifier: 3 } } },
        error: /no string/,
      },
      {
        name: '"_meta.previous.browseIdentifier" can be empty',
        shouldFail: false,
        data: { _meta: { current: { browseIdentifier: undefined } } },
      },
      {
        name: '"_meta.previous.offset" must be integer',
        shouldFail: true,
        data: { _meta: { previous: { offset: null } } },
        error: /no integer/,
      },
      {
        name: '"_meta.previous.limit" must be integer',
        shouldFail: true,
        data: { _meta: { previous: { limit: null } } },
        error: /no integer/,
      },
      {
        name: '"_meta.next.browseIdentifier" must be string',
        shouldFail: true,
        data: { _meta: { next: { browseIdentifier: 3 } } },
        error: /no string/,
      },
      {
        name: '"_meta.next.browseIdentifier" can be empty',
        shouldFail: false,
        data: { _meta: { current: { browseIdentifier: undefined } } },
      },
      {
        name: '"_meta.next.offset" must be integer',
        shouldFail: true,
        data: { _meta: { next: { offset: null } } },
        error: /no integer/,
      },
      {
        name: '"_meta.next.limit" must be integer',
        shouldFail: true,
        data: { _meta: { next: { limit: null } } },
        error: /no integer/,
      },

      {
        name: '"items" must be array',
        shouldFail: true,
        data: { items: null },
        error: /no array/,
      },
      {
        name: '"items[x].title" must be string',
        shouldFail: true,
        data: { items: [{ title: Math.PI }], error: /no string/ },
      },
      {
        name: '"items[x].thumbnailUri" must be string',
        shouldFail: true,
        data: { items: [{ thumbnailUri: Math.PI }], error: /no string/ },
      },
      {
        name: '"items[x].browseIdentifier" must be string',
        shouldFail: true,
        data: { items: [{ browseIdentifier: Math.PI }], error: /no string/ },
      },
      {
        name: '"items[x].actionIdentifier" must be string',
        shouldFail: true,
        data: { items: [{ actionIdentifier: Math.PI }], error: /no string/ },
      },
      {
        name: '"items[x].uiAction" must be string',
        shouldFail: true,
        data: { items: [{ uiAction: 2 }], error: /no string/ },
      },
    ];

    tests.forEach((test) => {
      it(test.name, () => {
        // GIVEN
        const testData = _merge(validList, test.data);

        // WHEN
        const fn = () => listValidation.validateList(testData);

        // THEN
        if (!test.shouldFail) {
          expect(fn).to.not.throw();
        } else {
          expect(fn).to.throw(test.error);
        }
      });
    });
  });
});
