"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var express = require("express");
var COMPONENTS = require("../../dynamicDevice/components");
var dynamicDevice = require("../../dynamicDevice/dynamicDevice");
var debug = Debug('neeo:driver:express:route:DeviceRoute');
var requestHandler;
function registerHandler(handler) {
    dynamicDevice.registerHandler(handler);
    requestHandler = handler;
}
exports.registerHandler = registerHandler;
var router = express.Router();
router.param('adapterid', function (req, res, next, adapterid) {
    return requestHandler
        .getDeviceByAdapterId(adapterid)
        .then(function (adapter) {
        req.adapter = adapter;
        next();
    })
        .catch(next);
});
router.param('component', function (req, res, next, component) {
    var handler = req.adapter.handler.get(component);
    if (handler) {
        debug('using static handler for component:', component);
        req.handler = handler;
        return next();
    }
    var adapterName = req.adapter.adapterName;
    if (!adapterName) {
        errorHandler("COMPONENT_HANDLER_NOT_FOUND " + adapterName + ":" + component, next);
        return;
    }
    debug('dynamic device needed for component:', component);
    dynamicDevice.storeDataInRequest(req, adapterName, component);
    next();
});
router.param('deviceid', function (req, res, next, deviceid) {
    req.deviceid = deviceid;
    var validParameters = dynamicDevice.validateDeviceIdRoute(req);
    if (!validParameters) {
        return errorHandler('DEVICEID_ROUTE_INVALID_PARAMETERS', next);
    }
    var isStaticDevice = req.handler;
    if (isStaticDevice) {
        return next();
    }
    dynamicDevice
        .storeDiscoveryHandlerInRequest(req)
        .then(function (dynamicRegisteredDeviceHandler) {
        if (dynamicRegisteredDeviceHandler) {
            return next();
        }
        debug('device not found with deviceId', deviceid);
        return errorHandler('DYNAMIC_REGISTERED_DEVICEID_NOT_FOUND', next);
    })
        .catch(function (error) {
        errorHandler(error.message, next);
    });
});
router.param('value', function (req, res, next, value) {
    if (typeof value === 'undefined' || value === null) {
        return errorHandler('VALUE_NOT_DEFINED', next);
    }
    req.value = value;
    next();
});
router.get('/:adapterid/registered', function (req, res, next) {
    debug('get registered request');
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_REGISTER_COMPONENT);
    requestHandler
        .isRegistered(handler)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.post('/:adapterid/register', function (req, res, next) {
    debug('post register request');
    var credentials = req.body;
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_REGISTER_COMPONENT);
    requestHandler
        .register(handler, credentials)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.get('/:adapterid/discover', function (req, res, next) {
    debug('discover request');
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_DISCOVER_COMPONENT);
    requestHandler
        .discover(handler)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.get('/:adapterid/subscribe/:deviceId/:eventUriPrefix', function (req, res, next) {
    var deviceId = req.params.deviceId;
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT);
    requestHandler
        .subscribe(handler, deviceId)
        .then(function () { return res.json({ success: true }); })
        .catch(next);
});
router.get('/:adapterid/unsubscribe/:deviceId', function (req, res, next) {
    var deviceId = req.params.deviceId;
    var handler = req.adapter.handler.get(COMPONENTS.NEEO_SDK_DEVICE_SUBSCRIPTION_COMPONENT);
    requestHandler
        .unsubscribe(handler, deviceId)
        .then(function () { return res.json({ success: true }); })
        .catch(next);
});
router.post('/:adapterid/:component/:deviceid/action', function (req, res, next) {
    debug('call action [%o]', req.params);
    var model = {
        handler: req.handler,
        deviceid: req.deviceid,
        body: req.body,
    };
    requestHandler
        .handleAction(model)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.get('/:adapterid/:component/:deviceid', function (req, res, next) {
    debug('get request [%o]', req.params);
    var model = {
        handler: req.handler,
        deviceid: req.deviceid,
    };
    requestHandler
        .handleGet(model)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.post('/:adapterid/:component/:deviceid', function (req, res, next) {
    debug('post request [%o]', req.params);
    var model = {
        handler: req.handler,
        deviceid: req.deviceid,
        body: req.body,
    };
    requestHandler
        .handleGet(model)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
router.get('/:adapterid/:component/:deviceid/:value', function (req, res, next) {
    debug('set request [%o]', req.params);
    var model = {
        handler: req.handler,
        deviceid: req.deviceid,
        value: req.value,
    };
    requestHandler
        .handleSet(model)
        .then(function (result) {
        res.json(result);
    })
        .catch(next);
});
function errorHandler(message, next) {
    debug('error handler %o', message);
    var err = new Error(message);
    Object.assign(err, { status: 404 });
    next(err);
}
exports.default = router;
//# sourceMappingURL=deviceRoute.js.map