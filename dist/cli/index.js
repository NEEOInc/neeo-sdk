#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var Debug = require("debug");
var deviceController = require("./deviceController");
var debug = Debug('neeo:cli:index');
var version = require('../../package.json').version;
var packageFile = {};
try {
    packageFile = require(process.cwd() + '/package.json');
}
catch (err) {
    debug('USING_DEFAULT_CONFIG', err.message);
}
process.on('SIGINT', function () { return process.exit(); });
process.on('exit', function () { return deviceController.stopDevices(); });
var _a = packageFile.neeoSdkOptions, neeoSdkOptions = _a === void 0 ? {} : _a;
commander
    .version(version)
    .option('-s, start', 'Start the SDK instance')
    .parse(process.argv);
if (!commander.start) {
    commander.help();
    process.exit(1);
}
deviceController.startDevices(neeoSdkOptions);
//# sourceMappingURL=index.js.map