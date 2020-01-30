"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alpaca = require("./alpaca.vars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Alpaca API
var _default = _axios.default.create({
  baseURL: APCA_API_BASE_URL,
  headers: {
    "APCA-API-KEY-ID": _alpaca.APCA_API_KEY,
    "APCA-API-SECRET-KEY": _alpaca.APCA_API_SECRET
  }
});

exports.default = _default;