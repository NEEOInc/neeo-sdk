'use strict';

const fs = require('fs');
const debug = require('debug')('neeo:device:Settings');
const Joi = require('joi');
const enjoi = require('enjoi');
const map = new Map();

module.exports = {
  init(key, options) {
    if (!key || !options || (!options.schemaLocation && !options.settingsFileLocation)) {
      debug('INVALID_SETTINGS_PARAMETERS');
      throw new Error('INVALID_SETTINGS_PARAMETERS');
    }

    if (map.has(key)) {
      debug('SETTINGS_KEY_ALREADY_EXISTS "%s"', key);
      throw new Error('SETTINGS_KEY_ALREADY_EXISTS');
    }

    if (!fs.existsSync(options.schemaLocation)) {
      debug('INVALID_SETTINGS_SCHEMA_LOCATION "%s"', options.schemaLocation);
      throw new Error('INVALID_SETTINGS_SCHEMA_LOCATION');
    }

    if (!fs.existsSync(options.settingsFileLocation)) {
      debug('INVALID_SETTINGS_FILE_LOCATION "%s"', options.settingsFileLocation);
      throw new Error('INVALID_SETTINGS_FILE_LOCATION');
    }

    const schema = enjoi(require(options.schemaLocation));
    const userDefinedSettings = require(options.settingsFileLocation);
    const {error, value} = Joi.validate(userDefinedSettings, schema);

    if (error) {
      debug('SETTINGS_VALIDATION_FAILED "%s" %o', key, error.details.map(detail => detail.message));
      throw new Error('SETTINGS_VALIDATION_FAILED');
    }

    debug('ASSIGNING_SETTINGS: %o', value);
    map.set(key, value);
  },

  get(key) {
    if (!map.has(key)) {
      debug('COULD_NOT_FIND_DEVICE_SETTINGS "%s"', key);
      throw new Error('COULD_NOT_FIND_DEVICE_SETTINGS');
    }

    return map.get(key);
  }
};
