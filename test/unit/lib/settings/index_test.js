'use strict';

const path = require('path');
const expect = require('chai').expect;
const {init, get} = require('../../../../lib/settings');
const VALID_SCHEMA_LOCATION = path.resolve(__dirname, './fixtures/settings-schema.json');
const MISSING_SCHEMA_LOCATION = path.resolve(__dirname, './invalid-path/fixtures/settings-schema.json');
const VALID_SETTINGS_LOCATION = path.resolve(__dirname, './fixtures/settings.json');
const INVALID_SETTINGS_LOCATION = path.resolve(__dirname, './fixtures/invalid-settings.json');
const MISSING_SETTINGS_LOCATION = path.resolve(__dirname, './invalid-path/fixtures/settings.json');

describe('./lib/settings/index.js', function() {

  it('should fail if no key is provided', function () {
    expect(function () {
      init();
    }).to.throw(/INVALID_SETTINGS_PARAMETERS/);
  });

  it('should fail if no options are provided', function () {
    expect(function () {
      init('my-key');
    }).to.throw(/INVALID_SETTINGS_PARAMETERS/);
  });

  it('should fail if there is a duplicate key', function () {
    const options = {
      schemaLocation: VALID_SCHEMA_LOCATION,
      settingsFileLocation: VALID_SETTINGS_LOCATION
    };

    expect(function () {
      init('my-key-1', options);
      init('my-key-1', options);
    }).to.throw(/SETTINGS_KEY_ALREADY_EXISTS/);
  });

  it('should fail if the schema location is invalid', function () {
    const options = {
      schemaLocation: MISSING_SCHEMA_LOCATION,
      settingsFileLocation: VALID_SETTINGS_LOCATION
    };

    expect(function () {
      init('my-key-2', options);
    }).to.throw(/INVALID_SETTINGS_SCHEMA_LOCATION/);
  });

  it('should fail if the settings file location is invalid', function () {
    const options = {
      schemaLocation: VALID_SCHEMA_LOCATION,
      settingsFileLocation: MISSING_SETTINGS_LOCATION
    };

    expect(function () {
      init('my-key-3', options);
    }).to.throw(/INVALID_SETTINGS_FILE_LOCATION/);
  });

  it('should fail if the user settings do not match the defined schema', function () {
    const options = {
      schemaLocation: VALID_SCHEMA_LOCATION,
      settingsFileLocation: INVALID_SETTINGS_LOCATION
    };

    expect(function () {
      init('my-key-4', options);
    }).to.throw(/SETTINGS_VALIDATION_FAILED/);
  });

  it('should fail to get settings if no key exists', function () {
    const options = {
      schemaLocation: VALID_SCHEMA_LOCATION,
      settingsFileLocation: VALID_SETTINGS_LOCATION
    };

    expect(function () {
      get('invalid-key', options);
    }).to.throw(/COULD_NOT_FIND_DEVICE_SETTINGS/);
  });

  it('should return the user defined options', function () {
    const options = {
      schemaLocation: VALID_SCHEMA_LOCATION,
      settingsFileLocation: VALID_SETTINGS_LOCATION
    };

    init('my-key-5', options);

    const settings = get('my-key-5');

    expect(settings).to.eql(require(VALID_SETTINGS_LOCATION));
  });

});
