"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plyAPI = exports.alpaca = exports.alpAPI = exports.APCA_API_KEY = exports.stkAPI = exports.STKTWTS_API_ACCESS_TOKEN = exports.db = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alpacaTradeApi = _interopRequireDefault(require("@alpacahq/alpaca-trade-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// LowDB
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./dist/db.json');
const db = low(adapter);
exports.db = db;
db.defaults({
  following: []
}).write(); // API Connections

// StockTwits
const STKTWTS_API_BASE_URL = 'https://api.stocktwits.com/api/2/';
const STKTWTS_API_ACCESS_TOKEN = '1fe2f9e9b8b0e2dfc94bcb8fdcf3479f24d9474a';
exports.STKTWTS_API_ACCESS_TOKEN = STKTWTS_API_ACCESS_TOKEN;

const stkAPI = _axios.default.create({
  baseURL: STKTWTS_API_BASE_URL
}); // Alpaca API


exports.stkAPI = stkAPI;
const APCA_API_BASE_URL = 'https://paper-api.alpaca.markets/v2/';
const APCA_API_KEY = 'PKOJ3SKL2S0C8U13OXUH';
exports.APCA_API_KEY = APCA_API_KEY;
const APCA_API_SECRET = 'HWpjGn5fsfisnNCeZbl3Q/ycFO7oDce7MLW1akjG';

const alpAPI = _axios.default.create({
  baseURL: APCA_API_BASE_URL,
  headers: {
    "APCA-API-KEY-ID": APCA_API_KEY,
    "APCA-API-SECRET-KEY": APCA_API_SECRET
  }
}); // Alpaca SDK


exports.alpAPI = alpAPI;
const PAPER = true;
const alpaca = new _alpacaTradeApi.default({
  keyId: APCA_API_KEY,
  secretKey: APCA_API_SECRET,
  paper: PAPER
}); // Polygon API

exports.alpaca = alpaca;
const PLY_API_BASE_URL = 'https://api.polygon.io/';

const plyAPI = _axios.default.create({
  baseURL: PLY_API_BASE_URL
});

exports.plyAPI = plyAPI;