"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alp = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _exports = require("./exports");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let websocket = _exports.alpaca.websocket;

let following = _exports.db.get('following');

const maxDollarBuy = 100;
const alp = {
  openOrders: null,

  async init() {
    console.log('Alpaca Init'); //  this.openOrders = await alpaca.getOrders({status: 'open'})
  },

  async newOrder(sym) {
    if ((await _exports.alpaca.getAccount().cash) < maxDollarBuy) return;
    const self = this;
    const channel = 'T.' + sym;
    websocket.connect();
    websocket.subscribe(channel);
    websocket.onStockTrades(async function (data) {
      const qty = Math.floor(maxDollarBuy / data.p, 0);
      console.log('New Order For: ' + sym + ': ' + qty + 'shares at ' + data.p + ' per share');
      await _exports.alpaca.createOrder({
        symbol: sym,
        qty,
        side: 'buy',
        type: 'market',
        time_in_force: 'ioc'
      }); // TODO: for extended hours must be limit order with TIF 'day'

      self.closeSubscription(channel);
    });
  },

  async newMsgs(userID, since) {
    const user = following.find({
      id: userID
    });
    const msgs = user.get('messages').find(function (o) {
      return o.id > since;
    }).value();
    const postitions = await _exports.alpaca.getPositions();
    console.log('Parsing new messages for: ' + user.value().username);

    if (postitions.legth) {
      for (let i in msgs) {
        const sym = msgs[i].symbols;

        for (let j in sym) {
          if (!(_lodash.default.findIndex(postitions, {
            symbol: sym
          }) > 0)) {
            this.newOrder(sym);
          }
        }
      }
    }
  },

  closeSubscription(channel) {
    websocket.unsubscribe(channel);
  }

};
exports.alp = alp;