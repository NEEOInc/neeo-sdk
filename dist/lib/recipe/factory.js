"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = require("axios");
var Debug = require("debug");
var debug = Debug('neeo:recipe:recipefactory');
var REST_OPTIONS = { timeout: 8000 };
var getData = function (url) {
    debug('GET URL %s', url);
    return axios_1.default.get(url, REST_OPTIONS).then(function (_a) {
        var data = _a.data;
        debug('action response: %o', data);
        return data;
    });
};
var buildFunction = function (url) { return function () { return getData(url); }; };
var buildGetPowerStateFunction = function (url) { return function () {
    return getData(url).then(function (data) {
        return data && data.active;
    });
}; };
function buildRecipesModel(rawRecipes) {
    if (!rawRecipes || !Array.isArray(rawRecipes)) {
        return [];
    }
    return rawRecipes
        .filter(function (recipe) { return recipe && recipe.detail && recipe.url; })
        .map(function (recipe) {
        var _a = recipe.url, identify = _a.identify, setPowerOff = _a.setPowerOff, setPowerOn = _a.setPowerOn, getPowerState = _a.getPowerState;
        return tslib_1.__assign({}, recipe, { action: {
                identify: buildFunction(identify),
                powerOn: buildFunction(setPowerOn),
                getPowerState: buildGetPowerStateFunction(getPowerState),
                powerOff: setPowerOff ? buildFunction(setPowerOff) : undefined,
            } });
    });
}
exports.buildRecipesModel = buildRecipesModel;
function validateActiveRecipesAnswer(answer) {
    if (!answer || !Array.isArray(answer)) {
        return false;
    }
    return true;
}
exports.validateActiveRecipesAnswer = validateActiveRecipesAnswer;
//# sourceMappingURL=factory.js.map