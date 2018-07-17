#!/usr/bin/env node
'use strict';

const debug = require('debug')('neeo:cli:index');
const commander = require('commander');
const version = require('../package.json').version;

let packageFile = {};
try {
  packageFile = require(process.cwd() + '/package.json');
} catch(err) {
  debug('USING_DEFAULT_CONFIG', err.message);
}

process.on('SIGINT', () => process.exit());
process.on('exit', () => deviceController.stopDevices());

const sdkOptions = packageFile.neeoSdkOptions || {};
const deviceController = require('./devicecontroller');

commander
  .version(version)
  .option('-s, start', 'Start the SDK instance')
  .parse(process.argv);

if (!commander.start) {
  commander.help();
  process.exit(1);
}
deviceController.startDevices(sdkOptions);
