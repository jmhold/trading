"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _alpacaTradeApi = _interopRequireDefault(require("@alpacahq/alpaca-trade-api"));

var _alpaca = require("./alpaca.vars");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Alpaca SDK
const PAPER = false;

var _default = new _alpacaTradeApi.default({
  keyId: process.env.NODE_ENV === 'dev' ? _alpaca.PAPER_APCA_API_KEY : _alpaca.APCA_API_KEY,
  secretKey: process.env.NODE_ENV === 'dev' ? _alpaca.PAPER_APCA_API_SECRET : _alpaca.APCA_API_SECRET,
  paper: PAPER
});

exports.default = _default;