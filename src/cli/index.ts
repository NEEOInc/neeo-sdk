#!/usr/bin/env node

// tslint:disable:no-var-requires

import * as commander from 'commander';
import * as Debug from 'debug';
import * as deviceController from './deviceController';

const debug = Debug('neeo:cli:index');
const version = require('../../package.json').version;

let packageFile: { neeoSdkOptions?: deviceController.SdkOptions } = {};

try {
  packageFile = require(process.cwd() + '/package.json');
} catch (err) {
  debug('USING_DEFAULT_CONFIG', err.message);
}

process.on('SIGINT', () => process.exit());
process.on('exit', () => deviceController.stopDevices());

const { neeoSdkOptions = {} } = packageFile;

commander
  .version(version)
  .option('-s, start', 'Start the SDK instance')
  .parse(process.argv);

if (!commander.start) {
  commander.help();
  process.exit(1);
}

deviceController.startDevices(neeoSdkOptions);
