"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _alpaca = _interopRequireDefault(require("../lib/alpaca.sdk"));

var _polygon = _interopRequireDefault(require("../lib/polygon.api"));

var _positions = _interopRequireDefault(require("../models/positions.model"));

var _alpaca2 = require("../lib/alpaca.vars");

var _exports = require("../lib/exports");

var _variable = require("./strategies/variable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let websocket = _alpaca.default.websocket;
const maxDollarBuy = 10;
var _default = {
  openOrders: null,
  positions: null,

  async init() {
    console.log('Alpaca Init');
    console.log('Get Positions Init');
    this.getPositions(); //  this.openOrders = await Alpaca.getOrders({status: 'open'})
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
      const alpCreateOrder = await _alpaca.default.createOrder({
        symbol: sym,
        qty: qty,
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
      }); // TODO: for extended hours must be limit order with TIF 'day'

      console.log('After createOrder call');
      console.log(alpCreateOrder);
    } catch (error) {
      _exports.utils.handleErrors(error);
    } //   self.closeSubscription(channel)
    // })

  },

  async newMsgSymbols(name, symbols) {
    this.positions = await _alpaca.default.getPositions();
    console.log('Parsing new messages for: ' + name);

    for (let j in symbols) {
      if (!(_lodash.default.findIndex(this.positions, {
        symbol: symbols[j].symbol
      }) > 0)) {
        console.log('Symbol: ' + symbols[j].symbol);
        this.newOrder(symbols[j].symbol);
      }
    }
  },

  async getPositions() {
    console.log('Get Positions');
    this.positions = await _alpaca.default.getPositions();
    this.updatePositions();
  },

  async prunePositions() {
    let storedPositions = await _positions.default.find({
      active: true
    });

    for (let i in storedPositions) {
      if (_lodash.default.findIndex(this.positions, {
        symbol: storedPositions[i].symbol
      }) === -1) {
        try {
          _positions.default.updateOne({
            symbol: storedPositions[i].symbol
          }, {
            active: false
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  },

  async updatePositions() {
    if (!this.positions) return;
    this.prunePositions();

    for (let i in this.positions) {
      const entry = this.positions[i].avg_entry_price;
      const current = this.positions[i].current_price;
      const plpc = Math.round(current / entry * 100) / 100;
      let pos = null;

      try {
        pos = await _positions.default.findOne({
          active: true,
          symbol: this.positions[i].symbol
        }, function (err, doc) {
          if (err) {
            console.log(err);
            return;
          }

          return doc;
        }).exec();
      } catch (error) {
        console.log(error);
      }

      if (!pos) {
        pos = new _positions.default({
          active: true,
          symbol: this.positions[i].symbol,
          max_price: current > entry ? current : entry,
          max_plpc: plpc > 1 ? plpc : 1,
          created: new Date()
        });
      } else {
        pos.max_price = pos.max_price > current ? pos.max_price : current;
        pos.max_plpc = pos.max_plpc > plpc ? pos.max_plpc : plpc;
      }

      try {
        pos.save();
      } catch (error) {
        console.log(error);
      }

      if (_lodash.default.findIndex(_variable.LONG_HOLDS, this.positions[i].symbol) != -1) return;
      let risk = 0;

      if (pos.max_plpc >= 1.1) {
        if (pos.max_plpc >= 4) {
          risk = 1;
        } else if (pos.max_plpc >= 2) {
          risk = 0.5;
        } else if (pos.max_plpc >= 1.5) {
          risk = 0.25;
        } else if (pos.max_plpc >= 1.25) {
          risk = 0.15;
        } else {
          risk = 0.10;
        }
      }

      if (plpc < .70 || risk && pos.max_plpc - plpc > risk) {
        this.liquidatePosition(this.positions[i]);
      }
    }
  },

  async liquidatePosition(pos) {
    await _alpaca.default.createOrder({
      symbol: pos.symbol,
      qty: pos.qty,
      side: 'sell',
      type: 'market',
      time_in_force: 'day'
    });
  },

  closeSubscription(channel) {
    websocket.unsubscribe(channel);
  }

};
exports.default = _default;