"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var requestHandler;
function registerHandler(handler) {
    requestHandler = handler;
}
exports.registerHandler = registerHandler;
var router = express
    .Router()
    .get('/search', function (_a, res) {
    var query = _a.query.q;
    res.json(query ? requestHandler.searchDevice(query) : []);
})
    .get('/adapterdefinition/:adapter_name', function (req, res, next) {
    var adapterName = req.params.adapter_name;
    try {
        res.json(requestHandler.getAdapterDefinition(adapterName));
    }
    catch (error) {
        next(error);
    }
})
    .get('/:device_id', function (_a, res) {
    var device_id = _a.params.device_id;
    res.json(requestHandler.getDevice(device_id));
});
exports.default = router;
//# sourceMappingURL=database.js.map