"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluePromise = require("bluebird");
var Debug = require("debug");
var os = require("os");
var brainLookup = require("./brainLookup");
var debug = Debug('neeo:discover:discover');
function discoverOneBrain(multiInterface) {
    if (!multiInterface) {
        return findFirstBrain().then(toBrain);
    }
    var interfaces = os.networkInterfaces();
    var discoveryPromises = Object.keys(interfaces)
        .map(function (net) {
        return interfaces[net]
            .filter(function (netInfo) { return netInfo.internal === false && netInfo.family === 'IPv4'; })
            .map(function (netIf) { return findFirstBrain(netIf.address); });
    })
        .reduce(function (result, currentInterface) { return result.concat(currentInterface); });
    return BluePromise.any(discoveryPromises)
        .then(toBrain)
        .catch(function (aggregateError) {
        throw aggregateError[0];
    });
}
exports.discoverOneBrain = discoverOneBrain;
function toBrain(service) {
    debug('buildNeeoEntry %o', service);
    return {
        name: service.name,
        host: service.host,
        port: service.port,
        version: service.txt.rel,
        region: service.txt.reg,
        iparray: service.addresses,
    };
}
function findFirstBrain(networkInterface) {
    return brainLookup.findFirstBrain(networkInterface).toPromise();
}
//# sourceMappingURL=index.js.map