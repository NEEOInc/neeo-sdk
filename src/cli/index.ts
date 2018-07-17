import { join } from 'path';
import * as yargs from 'yargs';
import * as Debug from 'debug';
import * as deviceController from './deviceController';

const debug = Debug('neeo:cli:index');

let packageFile: { neeoSdkOptions?: deviceController.SdkOptions };
try {
  packageFile = require(join(process.cwd(), 'package.json'));
} catch (err) {
  debug('USING_DEFAULT_CONFIG', err.message);
  packageFile = {};
}

const { neeoSdkOptions = {} } = packageFile;
const { argv } = yargs
  .usage('Usage: neeo-sdk <command>')
  .command('start', 'start the SDK instance')
  .help('h')
  .alias('h', 'help');

process
  .on('SIGINT', () => process.exit())
  .on('exit', deviceController.stopDevices);

function execute() {
  const {
    _: [command]
  } = argv;
  switch (command) {
    case 'start':
      deviceController.startDevices(neeoSdkOptions);
      return;
  }
  console.warn('Unknown command:', command);
  process.exit();
}

execute();
