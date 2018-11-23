"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BluePromise = require("bluebird");
var Debug = require("debug");
var urlBuilder_1 = require("../device/brain/urlBuilder");
var factory = require("./factory");
var debug = Debug('neeo:recipe:recipe');
var BASE_URL_GETRECIPES = '/v1/api/recipes';
var BASE_URL_GETACTIVERECIPES = '/v1/api/activeRecipes';
var REST_OPTIONS = { timeout: 8000 };
var getRecipesPowerState = getActiveRecipes;
exports.getRecipesPowerState = getRecipesPowerState;
function getActiveRecipes(brain) {
    if (!brain) {
        return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
    }
    var url = urlBuilder_1.default(brain, BASE_URL_GETACTIVERECIPES);
    debug('GET getActiveRecipes %s', url);
    return axios_1.default.get(url, REST_OPTIONS).then(function (response) {
        if (factory.validateActiveRecipesAnswer(response.data)) {
            return response.data;
        }
        debug('invalid answer %o', response.data);
        return [];
    });
}
exports.getActiveRecipes = getActiveRecipes;
function getRecipes(brain) {
    if (!brain) {
        return BluePromise.reject(new Error('MISSING_BRAIN_PARAMETER'));
    }
    var url = urlBuilder_1.default(brain, BASE_URL_GETRECIPES);
    debug('GET AllRecipes %s', url);
    return axios_1.default
        .get(url, REST_OPTIONS)
        .then(function (_a) {
        var rawRecipes = _a.data;
        return factory.buildRecipesModel(rawRecipes);
    });
}
exports.getRecipes = getRecipes;
//# sourceMappingURL=index.js.map