#!/usr/bin/env node
'use strict';

const packageFile = require(process.cwd() + '/package.json');
const sdkOptions = packageFile.neeoSdkOptions || {};
const deviceController = require('./devicecontroller');

const argv = require('yargs')
  .usage('Usage: neeo-sdk <command>')
  .command('start', 'start the SDK instance')
  .help('h')
  .alias('h', 'help').argv;

process.on('SIGINT', () => process.exit());
process.on('exit', () => deviceController.stopDevices());

execute(argv._);

function execute(options) {
  const command = options[0];

  switch (command) {
    case 'start':
      deviceController.startDevices(sdkOptions);
      return;
  }

  console.warn('Unknown command:', command);
  process.exit();
}
