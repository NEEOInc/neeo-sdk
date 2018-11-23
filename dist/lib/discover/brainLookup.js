"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var rxjs_1 = require("rxjs");
var config_1 = require("../config");
var mdns = require("./mdns");
var operators_1 = require("rxjs/operators");
var semver_1 = require("semver");
var DEFAULT_LOOKUP_DURATION_MS = config_1.default.brainLookupDurationMs;
function findFirstBrain(networkInterface, lookupDurationMs, scheduler) {
    if (lookupDurationMs === void 0) { lookupDurationMs = DEFAULT_LOOKUP_DURATION_MS; }
    if (scheduler === void 0) { scheduler = rxjs_1.asyncScheduler; }
    return mdns.getMdnsStream(networkInterface).pipe(operators_1.timeout(lookupDurationMs, scheduler), operators_1.filter(isValidBrainService), operators_1.filter(hasAddress), operators_1.concatMap(getBrainWithValidVersionStream), operators_1.first(), operators_1.catchError(function (error) {
        if (error instanceof rxjs_1.TimeoutError) {
            throw new Error("No Brain found after " + DEFAULT_LOOKUP_DURATION_MS + "ms!");
        }
        throw error;
    }));
}
exports.findFirstBrain = findFirstBrain;
function isValidBrainService(service) {
    return service && service.txt;
}
function hasAddress(service) {
    var serviceHasAnyAddress = service.addresses.length > 0;
    if (!serviceHasAnyAddress) {
        console.warn("The Brain " + service.name + " has been skipped from the lookup because it does not have any address");
    }
    return serviceHasAnyAddress;
}
function getBrainWithValidVersionStream(service) {
    var systemInfoUrl = getBrainSystemInfoUrl(service);
    var stream$ = rxjs_1.from(axios_1.default.get(systemInfoUrl));
    return stream$.pipe(operators_1.map(function (response) { return response.data.firmwareVersion; }), operators_1.filter(function (version) { return isSatisfied({ name: service.name, version: version }); }), operators_1.map(function () { return service; }));
}
function getBrainSystemInfoUrl(service) {
    return "http://" + service.addresses[0] + ":" + service.port + "/systeminfo";
}
function isSatisfied(_a) {
    var name = _a.name, version = _a.version;
    var brainVersionSatisfaction = config_1.default.brainVersionSatisfaction;
    var versionSatisfied = semver_1.satisfies(semver_1.coerce(version), brainVersionSatisfaction);
    if (!versionSatisfied) {
        console.warn("The Brain " + name + " has been skipped from the lookup because its firmware version does not satisfy " + brainVersionSatisfaction);
    }
    return versionSatisfied;
}
//# sourceMappingURL=brainLookup.js.map