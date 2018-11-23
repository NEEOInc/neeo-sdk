"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var crypto = require("../crypto");
var router = express.Router().get('/pubkey', function (req, res, next) {
    return crypto
        .getPublicKey()
        .then(function (publickey) { return res.json({ publickey: publickey }); })
        .catch(next);
});
exports.default = router;
//# sourceMappingURL=secure.js.map