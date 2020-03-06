"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polygonSDK = exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alpaca = require("./alpaca.vars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Polygon API
var PLY_API_BASE_URL = 'https://api.polygon.io/';

var _default = _axios["default"].create({
  baseURL: PLY_API_BASE_URL
});

exports["default"] = _default;

var Polygon = _axios["default"].create({
  baseURL: PLY_API_BASE_URL
});

var polygonSDK = {
  allTickers: function allTickers(date) {
    // return this.polygonGet(`/v2/aggs/grouped/locale/US/market/STOCKS/${date}`)
    return this.polygonGet("/v2/snapshot/locale/us/markets/stocks/tickers");
  },
  dailyAgg: function dailyAgg(ticker, from, to) {
    return this.polygonGet("/v2/aggs/ticker/".concat(ticker, "/range/1/day/").concat(from, "/").concat(to));
  },
  snapshot: function snapshot(ticker) {
    return this.polygonGet("/v2/snapshot/locale/us/markets/stocks/tickers/".concat(ticker));
  },
  polygonGet: function polygonGet(endpoint) {
    return Polygon.get(endpoint, {
      params: {
        apiKey: _alpaca.APCA_API_KEY
      }
    });
  }
};
exports.polygonSDK = polygonSDK;