"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _alpaca = _interopRequireDefault(require("../lib/alpaca.sdk"));

var _polygon = _interopRequireDefault(require("../lib/polygon.api"));

var _positions = _interopRequireDefault(require("../models/positions.model"));

var _alpaca2 = require("../lib/alpaca.vars");

var _exports = require("../lib/exports");

var _variable = require("./strategies/variable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var websocket = _alpaca["default"].websocket;
var maxDollarBuy = 10;
var _default = {
  openOrders: null,
  positions: null,
  init: function init() {
    var _this = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('Alpaca Init');

              _this.getPositions(); //  this.openOrders = await Alpaca.getOrders({status: 'open'})


            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  newOrder: function newOrder(sym) {
    var _this2 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var self, channel, lastTrade, price, qty, alpCreateOrder;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _alpaca["default"].getAccount().cash;

            case 2:
              _context2.t0 = _context2.sent;
              _context2.t1 = maxDollarBuy;

              if (!(_context2.t0 < _context2.t1)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return");

            case 6:
              self = _this2;
              channel = 'T.' + sym; // websocket.connect()
              // websocket.subscribe(channel)
              // websocket.onStockTrades(async data => {
              // const qty = Math.floor(maxDollarBuy/data.p, 0)

              _context2.prev = 8;
              _context2.next = 11;
              return _polygon["default"].get('v1/last/stocks/' + sym, {
                params: {
                  apiKey: _alpaca2.APCA_API_KEY
                }
              });

            case 11:
              lastTrade = _context2.sent;
              price = lastTrade.data.last.price;
              qty = Math.floor(maxDollarBuy / price, 0);
              console.log('New Order For: ' + sym + ': ' + qty + ' shares at ' + price + ' per share');
              _context2.next = 17;
              return _alpaca["default"].createOrder({
                symbol: sym,
                qty: qty,
                side: 'buy',
                type: 'market',
                time_in_force: 'day'
              });

            case 17:
              alpCreateOrder = _context2.sent;
              _context2.next = 23;
              break;

            case 20:
              _context2.prev = 20;
              _context2.t2 = _context2["catch"](8);

              _exports.utils.handleErrors(_context2.t2);

            case 23:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[8, 20]]);
    }))();
  },
  newMsgSymbols: function newMsgSymbols(name, symbols) {
    var _this3 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var j;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _alpaca["default"].getPositions();

            case 2:
              _this3.positions = _context3.sent;

              for (j in symbols) {
                if (!(_lodash["default"].findIndex(_this3.positions, {
                  symbol: symbols[j].symbol
                }) > 0)) {
                  _this3.newOrder(symbols[j].symbol);
                }
              }

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  getPositions: function getPositions() {
    var _this4 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _alpaca["default"].getPositions();

            case 2:
              _this4.positions = _context4.sent;

              _this4.updatePositions();

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  },
  prunePositions: function prunePositions() {
    var _this5 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var storedPositions, i, doc;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _positions["default"].find({
                active: true
              });

            case 2:
              storedPositions = _context5.sent;
              _context5.t0 = regeneratorRuntime.keys(storedPositions);

            case 4:
              if ((_context5.t1 = _context5.t0()).done) {
                _context5.next = 21;
                break;
              }

              i = _context5.t1.value;

              if (!(_lodash["default"].findIndex(_this5.positions, {
                symbol: storedPositions[i].symbol
              }) === -1)) {
                _context5.next = 19;
                break;
              }

              _context5.prev = 7;
              _context5.next = 10;
              return _positions["default"].findOne({
                symbol: storedPositions[i].symbol
              });

            case 10:
              doc = _context5.sent;
              doc.active = false;
              doc.save = false;
              console.log("THE NEW ACTIVE VLAUE IS: ".concat(doc.active));
              _context5.next = 19;
              break;

            case 16:
              _context5.prev = 16;
              _context5.t2 = _context5["catch"](7);
              console.log(_context5.t2);

            case 19:
              _context5.next = 4;
              break;

            case 21:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[7, 16]]);
    }))();
  },
  updatePositions: function updatePositions() {
    var _this6 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var i, entry, current, plpc, pos, risk;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (_this6.positions) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return");

            case 2:
              _this6.prunePositions();

              _context6.t0 = regeneratorRuntime.keys(_this6.positions);

            case 4:
              if ((_context6.t1 = _context6.t0()).done) {
                _context6.next = 28;
                break;
              }

              i = _context6.t1.value;
              entry = _this6.positions[i].avg_entry_price;
              current = _this6.positions[i].current_price;
              plpc = Math.round(current / entry * 100) / 100;
              pos = null;
              _context6.prev = 10;
              _context6.next = 13;
              return _positions["default"].findOne({
                active: true,
                symbol: _this6.positions[i].symbol
              }, function (err, doc) {
                if (err) {
                  console.log(err);
                  return;
                }

                return doc;
              }).exec();

            case 13:
              pos = _context6.sent;
              _context6.next = 19;
              break;

            case 16:
              _context6.prev = 16;
              _context6.t2 = _context6["catch"](10);
              console.log(_context6.t2);

            case 19:
              if (!pos) {
                pos = new _positions["default"]({
                  active: true,
                  symbol: _this6.positions[i].symbol,
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

              if (!(_lodash["default"].findIndex(_variable.LONG_HOLDS, _this6.positions[i].symbol) != -1)) {
                _context6.next = 23;
                break;
              }

              return _context6.abrupt("return");

            case 23:
              risk = 0;

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
                console.log('**********************');
                console.log('LIQUIDATE');
                console.log('**********************');
                console.log("SYMBOL             ".concat(_this6.positions[i].symbol));
                console.log("RISK               ".concat(risk));
                console.log("THIS PNL PERCENT   ".concat(plpc));
                console.log("THIS PNL COND      ".concat(plpc < .70));
                console.log("MAX PNL PERCENT    ".concat(pos.max_plpc));
                console.log("MAX - PNL PERCENT  ".concat(pos.max_plpc - plpc));
                console.log("MAX COND           ".concat(risk && pos.max_plpc - plpc > risk));

                _this6.liquidatePosition(_this6.positions[i]);
              }

              _context6.next = 4;
              break;

            case 28:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[10, 16]]);
    }))();
  },
  liquidatePosition: function liquidatePosition(pos) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _positions["default"].updateOne({
                symbol: pos.symbol
              }, {
                active: false
              });

              _context7.next = 3;
              return _alpaca["default"].createOrder({
                symbol: pos.symbol,
                qty: pos.qty,
                side: 'sell',
                type: 'market',
                time_in_force: 'day'
              });

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  },
  closeSubscription: function closeSubscription(channel) {
    websocket.unsubscribe(channel);
  }
};
exports["default"] = _default;