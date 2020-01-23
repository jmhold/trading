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
    const channel = 'T.' + sym; // websocket.connect()
    // websocket.subscribe(channel)
    // websocket.onStockTrades(async data => {
    // const qty = Math.floor(maxDollarBuy/data.p, 0)

    try {
      const lastTrade = await _exports.plyAPI.get('v1/last/stocks/' + sym, {
        params: {
          apiKey: _exports.APCA_API_KEY
        }
      });
      const price = lastTrade.data.last.price;
      const qty = Math.floor(maxDollarBuy / price, 0);
      console.log('New Order For: ' + sym + ': ' + qty + ' shares at ' + price + ' per share');
      await _exports.alpaca.createOrder({
        symbol: sym,
        qty: qty,
        side: 'buy',
        type: 'market',
        time_in_force: 'ioc'
      }); // TODO: for extended hours must be limit order with TIF 'day'
    } catch (error) {
      console.log(error);
    } //   self.closeSubscription(channel)
    // })

  },

  async newMsgs(userID) {
    const user = following.find({
      id: userID
    });
    const latestMsgId = user.value().latestMsgId;
    const msgs = user.get('messages').filter(function (o) {
      return o.id > latestMsgId;
    }).value();
    const postitions = await _exports.alpaca.getPositions();
    console.log('Parsing new messages for: ' + user.value().name);

    for (let i in msgs) {
      const symbols = msgs[i].symbols;

      if (msgs[i].id > user.value().latestMsgId) {
        user.set('latestMsgId', msgs[i].id).write();
      }

      for (let j in symbols) {
        if (!(_lodash.default.findIndex(postitions, {
          symbol: symbols[j].symbol
        }) > 0)) {
          console.log('Symbol: ' + symbols[j].symbol);
          this.newOrder(symbols[j].symbol);
        }
      }
    }
  },

  closeSubscription(channel) {
    websocket.unsubscribe(channel);
  }

};
exports.alp = alp;