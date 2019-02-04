import * as Models from '../../models';

export function hasNoInputButtonsDefined(
  buttons: ReadonlyArray<{ param: Models.ButtonDescriptor }>
) {
  if (!Array.isArray(buttons)) {
    throw new Error('NOT_ARRAY_PARAMETER');
  }
  return buttons.every(({ param }) => !param || !param.name || !/INPUT.*/.test(param.name));
}
