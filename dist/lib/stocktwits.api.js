"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.STKTWTS_API_ACCESS_TOKEN = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// StockTwits
var STKTWTS_API_BASE_URL = 'https://api.stocktwits.com/api/2/';
var STKTWTS_API_ACCESS_TOKEN = '1fe2f9e9b8b0e2dfc94bcb8fdcf3479f24d9474a';
exports.STKTWTS_API_ACCESS_TOKEN = STKTWTS_API_ACCESS_TOKEN;

var _default = _axios["default"].create({
  baseURL: STKTWTS_API_BASE_URL
});

exports["default"] = _default;