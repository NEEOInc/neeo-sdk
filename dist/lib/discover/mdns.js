"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bonjour = require("bonjour");
var rxjs_1 = require("rxjs");
var MDNS_NAME = 'neeo';
function getMdnsStream(networkInterface) {
    return rxjs_1.Observable.create(function (observer) {
        bonjour({ interface: networkInterface }).find({ type: MDNS_NAME }, function (service) {
            observer.next(service);
        });
    });
}
exports.getMdnsStream = getMdnsStream;
//# sourceMappingURL=mdns.js.map