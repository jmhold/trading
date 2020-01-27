"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _alpaca = _interopRequireDefault(require("./lib/alpaca.sdk"));

var _polygon = _interopRequireDefault(require("./lib/polygon.api"));

var _alpaca2 = require("./lib/alpaca.vars");

var _exports = require("./exports");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let websocket = _alpaca.default.websocket;
const maxDollarBuy = 100;
var _default = {
  openOrders: null,

  async init() {
    console.log('Alpaca Init'); //  this.openOrders = await Alpaca.getOrders({status: 'open'})
  },

  async newOrder(sym) {
    if ((await _alpaca.default.getAccount().cash) < maxDollarBuy) return;
    const self = this;
    const channel = 'T.' + sym; // websocket.connect()
    // websocket.subscribe(channel)
    // websocket.onStockTrades(async data => {
    // const qty = Math.floor(maxDollarBuy/data.p, 0)

    try {
      const lastTrade = await _polygon.default.get('v1/last/stocks/' + sym, {
        params: {
          apiKey: _alpaca2.APCA_API_KEY
        }
      });
      const price = lastTrade.data.last.price;
      const qty = Math.floor(maxDollarBuy / price, 0);
      console.log('New Order For: ' + sym + ': ' + qty + ' shares at ' + price + ' per share');
      await _alpaca.default.createOrder({
        symbol: sym,
        qty: qty,
        side: 'buy',
        type: 'market',
        time_in_force: 'ioc'
      }); // TODO: for extended hours must be limit order with TIF 'day'
    } catch (error) {
      _exports.utils.handleErrors(error);
    } //   self.closeSubscription(channel)
    // })

  },

  async newMsgSymbols(name, symbols) {
    const postitions = await _alpaca.default.getPositions();
    console.log('Parsing new messages for: ' + name);

    for (let j in symbols) {
      if (!(_lodash.default.findIndex(postitions, {
        symbol: symbols[j].symbol
      }) > 0)) {
        console.log('Symbol: ' + symbols[j].symbol);
        this.newOrder(symbols[j].symbol);
      }
    }
  },

  closeSubscription(channel) {
    websocket.unsubscribe(channel);
  }

};
exports.default = _default;