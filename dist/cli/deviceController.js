"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../lib");
var deviceLoader = require("./deviceLoader");
var NEEO_SDK_DEFAULT_LISTENING_PORT = 6336;
var serverConfiguration;
function stopDevices() {
    if (!serverConfiguration) {
        return;
    }
    lib_1.stopServer(serverConfiguration).catch(function (error) {
        console.error('ERROR!', error.message);
        process.exit();
    });
}
exports.stopDevices = stopDevices;
function startDevices(options) {
    if (options === void 0) { options = {}; }
    return Promise.all([loadDevices(), getBrain(options)])
        .then(function (_a) {
        var devices = _a[0], brain = _a[1];
        console.info('- Start server, connect to NEEO Brain:', {
            brain: brain.name || 'unknown',
            host: brain.host,
            port: brain.port,
        });
        storeSdkServerConfiguration(brain, options, devices);
        return lib_1.startServer(serverConfiguration);
    })
        .then(function () {
        console.info('# Your devices are now ready to use in the NEEO app!');
    })
        .catch(function (error) {
        console.error('ERROR!', error);
        process.exit(1);
    });
}
exports.startDevices = startDevices;
function storeSdkServerConfiguration(brain, _a, devices) {
    var serverPort = _a.serverPort, serverName = _a.serverName;
    serverConfiguration = {
        brain: brain,
        port: serverPort || NEEO_SDK_DEFAULT_LISTENING_PORT,
        name: serverName || 'default',
        devices: devices,
    };
}
function getBrain(options) {
    return isBrainDefinedIn(options) ? getBrainFrom(options) : findBrain();
}
function isBrainDefinedIn(_a) {
    var brainHost = _a.brainHost;
    return (brainHost && brainHost !== '') || process.env.BRAINIP;
}
function loadDevices() {
    return new Promise(function (resolve, reject) {
        var devices = deviceLoader.loadDevices();
        if (!devices.length) {
            return reject(new Error('No devices found! Make sure you expose devices in the "devices" directory ' +
                'or install external drivers through npm.'));
        }
        resolve(devices);
    });
}
function getBrainFrom(_a) {
    var brainHost = _a.brainHost, brainPort = _a.brainPort;
    return Promise.resolve({
        host: brainHost || process.env.BRAINIP,
        port: brainPort || 3000,
    });
}
function findBrain() {
    console.info('No Brain address configured, attempting to discover one...');
    return lib_1.discoverOneBrain().then(function (brain) {
        console.info('- Brain discovered:', brain.name);
        return brain;
    });
}
//# sourceMappingURL=deviceController.js.map