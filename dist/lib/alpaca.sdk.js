"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperAlpaca = exports["default"] = void 0;

var _alpacaTradeApi = _interopRequireDefault(require("@alpacahq/alpaca-trade-api"));

var _alpaca = require("./alpaca.vars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Alpaca SDK
var _default = new _alpacaTradeApi["default"]({
  keyId: _alpaca.APCA_API_KEY,
  secretKey: _alpaca.APCA_API_SECRET,
  paper: false
});

exports["default"] = _default;
var PaperAlpaca = new _alpacaTradeApi["default"]({
  keyId: _alpaca.PAPER_APCA_API_KEY,
  secretKey: _alpaca.PAPER_APCA_API_SECRET,
  paper: true
});
exports.PaperAlpaca = PaperAlpaca;