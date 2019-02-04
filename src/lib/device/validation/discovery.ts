import { Discovery } from '../../models';

export {
  validate,
};

function validate(options: Discovery.Options, controller: Discovery.Controller) {
  if (typeof controller !== 'function') {
    throw new Error('INVALID_DISCOVERY_FUNCTION');
  }
  if (!options) {
    throw new Error('INVALID_DISCOVERY_PARAMETER');
  }
  if (!options.headerText) {
    throw new Error('INVALID_DISCOVERY_PARAMETER: headerText');
  }
  if (!options.description) {
    throw new Error('INVALID_DISCOVERY_PARAMETER: description');
  }
}
