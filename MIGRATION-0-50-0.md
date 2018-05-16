# Migrate my driver to 0.50.0

0.50.0 comes with a new way of running the drivers through a `neeo-sdk` CLI.
This version makes the use of `startServer` deprecated, and there is no need for the developer to manually call the `disoverOneBrain` function.
This page will guide you through the steps required to migrate your old driver implementation to 0.50.0.

## Move the device source files to a `devices` directory

The first step is to create a new directory called `devices` at the root of the project, and move all source files related to the driver there. If you want to use another directory, you have to set the environment variable `NEEO_DEVICES_DIRECTORY`. The path needs to be relative to the root of your project. For instance: `lib/devices`.

## Delete calls to `startServer` and `discoverOneBrain` and export the device

The next step is to modify the file that you use as the entry point of your driver, and delete the calls that were previously required to run the server. Instead, you need to export your device through a `devices` Array:

```diff
// lifx/index.js
'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./lifxcontroller');

const slider = {
  name: 'brightness',
  label: 'Dimmer',
  range: [0, 100],
  unit: '%'
};
const powerSwitch = {
  name: 'power',
  label: 'Power'
};
const ambientLightSensor = {
  name: 'ambientlight',
  label: 'Ambient Light Sensor',
  range: [0, 10],
  unit: 'Brightness'
};
const discoveryInstructions = {
  headerText: 'Discover devices',
  description: 'NEEO will discover your LIFX lights now, press NEXT'
};
const POWER_TOGGLE_BUTTON = { name: 'POWER_TOGGLE', label: 'Power Toggle' };
const ALERT_BUTTON = { name: 'ALERT', label: 'Alert' };

const lifx = neeoapi.buildDevice('Smart Light')
  .setManufacturer('LIFX')
  .addAdditionalSearchToken('lamp')
  .setType('LIGHT')
  .addButtonGroup('Power')
  .addButton(POWER_TOGGLE_BUTTON)
  .addButton(ALERT_BUTTON)
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(slider, controller.brightnessSliderCallback)
  .addSwitch(powerSwitch, controller.powerSwitchCallback)
  .addSensor(ambientLightSensor, controller.ambientLightSensorCallback)
  .enableDiscovery(discoveryInstructions, controller.discoverDevices)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .registerInitialiseFunction(controller.initialise);

- console.log('- discover one NEEO Brain...');
- neeoapi.discoverOneBrain()
-   .then((brain) => {
-     console.log('- Brain discovered:', brain.name);
-
-     console.log('- Start server');
-     return neeoapi.startServer({
-       brain,
-       port: 6336,
-       name: 'lifx',
-       devices: [lifx]
-     });
-  })
-  .then(() => {
-    console.log('# READY! use the NEEO app to search for "LIFX".');
-  })
-  .catch((err) => {
-    console.error('ERROR!', err);
-    process.exit(1);
-  });

+ module.exports = {
+   devices = [lifx]
+}
```

## Update the NPM run script

The last step is to update the run script in your `package.json` file to use the CLI:
```diff
// package.json
{
  "name": "lifx-example",
  "version": "0.50.0",
  "description": "LIFX Example",
  "repository": "https://github.com/NEEOInc/lifx-example",
  "license": "MIT",
  "private": false,
  "dependencies": {
    "bluebird": "^3.5.0",
    "lifx-http-api": "^1.0.3",
    "neeo-sdk": "^0.50.0",
    "node-lifx": "^0.8.0"
  },
  "engines": {
    "node": ">=6.0.0"
  },
  "scripts": {
    "test": "mocha --exit \"test/**/*.js\"",
-    "server:lifx": "node lifx/index.js",
+    "server:lifx": "neeo-sdk start"
  },
  "devDependencies": {
    "chai": "^4.1.2",
    "jshint": "^2.9.5",
    "mocha": "^5.0.4",
    "mockery": "^2.1.0",
    "sinon": "^4.4.2"
  }
}
```
