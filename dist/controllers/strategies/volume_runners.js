"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _lodash = _interopRequireDefault(require("lodash"));

require("core-js");

require("regenerator-runtime/runtime");

var _polygon = require("../../lib/polygon.api");

var _alpaca = _interopRequireWildcard(require("../../lib/alpaca.sdk"));

var _utils = _interopRequireDefault(require("../../lib/utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import Alpaca from '../../lib/alpaca.sdk'
var _Symbol = {
  symbol: null,
  price: null,
  highOfDay: null,
  openOfDay: null,
  currentVolume: null,
  addedStrategies: [],
  averageVolume: null,
  entries: [],
  exits: [],
  poller: null,
  update: function update(self) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var response, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, strategy;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (self.symbol) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              _context.next = 5;
              return _polygon.polygonSDK.snapshot(self.symbol);

            case 5:
              response = _context.sent;
              self.price = response.data.ticker.lastTrade['p'];
              self.highOfDay = response.data.ticker.day['h'];
              self.openOfDay = response.data.ticker.day['o'];
              self.currentVolume = response.data.ticker.day['v'];
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);

            case 15:
              if (!self.addedStrategies.length) {
                _context.next = 35;
                break;
              }

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 19;

              for (_iterator = self.addedStrategies[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                strategy = _step.value;
                self.lookforExit(strategy);
              }

              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context["catch"](19);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 27:
              _context.prev = 27;
              _context.prev = 28;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 30:
              _context.prev = 30;

              if (!_didIteratorError) {
                _context.next = 33;
                break;
              }

              throw _iteratorError;

            case 33:
              return _context.finish(30);

            case 34:
              return _context.finish(27);

            case 35:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 12], [19, 23, 27, 35], [28,, 30, 34]]);
    }))();
  },
  getAverageVolume: function getAverageVolume(period) {
    var _this = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var to, from, dailyBars, totalVolume, response, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, bar;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              period = period || 40;
              period = period + Math.ceil(period / 7) * 2; // Fuzzy math here to account for weekends

              to = new Date();
              from = new Date();
              from.setDate(to.getDate() - period);
              totalVolume = 0;
              _context2.prev = 6;
              _context2.next = 9;
              return _polygon.polygonSDK.dailyAgg(_this.symbol, from.getTime(), to.getTime());

            case 9:
              response = _context2.sent;
              dailyBars = response.data.results;

              if (dailyBars) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("return");

            case 13:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 16;

              for (_iterator2 = dailyBars[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                bar = _step2.value;
                totalVolume += bar['v'];
              }

              _context2.next = 24;
              break;

            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](16);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;

            case 24:
              _context2.prev = 24;
              _context2.prev = 25;

              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }

            case 27:
              _context2.prev = 27;

              if (!_didIteratorError2) {
                _context2.next = 30;
                break;
              }

              throw _iteratorError2;

            case 30:
              return _context2.finish(27);

            case 31:
              return _context2.finish(24);

            case 32:
              return _context2.abrupt("return", Math.floor(totalVolume / period));

            case 35:
              _context2.prev = 35;
              _context2.t1 = _context2["catch"](6);
              console.log(_context2.t1);

            case 38:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[6, 35], [16, 20, 24, 32], [25,, 27, 31]]);
    }))();
  },
  setAverageVolume: function setAverageVolume() {
    var _this2 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(_this2.averageVolume.then && typeof _this2.averageVolume.then === 'function')) {
                _context3.next = 3;
                break;
              }

              _context3.next = 3;
              return _this2.averageVolume.then(function (val) {
                return _this2.averageVolume = val;
              });

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },

  get relativeVolume() {
    return this.currentVolume / this.averageVolume;
  },

  get isHOD() {
    return this.price > this.highOfDay * .99;
  },

  get position() {
    return 0; // return (async () => {
    //     try{
    //         return await PaperAlpaca.getPosition(this.symbol)
    //     } catch (err) {
    //         console.log(err)
    //         return null
    //     }
    // })()
  },

  makeOrder: function makeOrder(qty, side) {
    var _this3 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _alpaca.PaperAlpaca.createOrder({
                symbol: _this3.symbol,
                qty: qty,
                side: side,
                type: 'market',
                time_in_force: 'day'
              });

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](0);
              console.log(_context4.t0);
              return _context4.abrupt("return", null);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 6]]);
    }))();
  },
  lookForEntry: function lookForEntry(strategy) {
    var entries = strategy.triggers.entry;

    for (var key in entries) {
      var value = typeof entries[key].value === 'string' ? this[entries[key].value] : entries[key].value;
      if (!_utils["default"].compare(entries[key].condition, this[key], value)) return;
    }

    console.log("Adding ".concat(this.symbol, " to ").concat(strategy.name));
    this.addedStrategies.push(strategy);
    this.addEntry();
  },
  lookforExit: function lookforExit(strategy) {
    var exits = strategy.triggers.exit;

    for (var key in exits) {
      var value = typeof exit[key].value === 'string' ? this[value] : exit[key].value;
      if (!_utils["default"].compare(exit[key].condition, this[key], value)) return;
    }

    console.log("Closing ".concat(this.symbol, " to ").concat(strategy.name));
    this.addedStrategies.filter(function (item) {
      return item.name != strategy.name;
    });
    this.addExit();
  },
  addEntry: function addEntry(costBasis) {
    var _this4 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var side, qty, order;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              side = 'buy';
              qty = Math.floor(costBasis / _this4.price);
              _context5.next = 5;
              return makeOrder(qty, side);

            case 5:
              order = _context5.sent;

              if (!(order && order.status === 'filled')) {
                _context5.next = 12;
                break;
              }

              _this4.entries.push({
                dateTime: new Date(),
                price: order.filled_avg_price,
                qty: qty
              });

              _this4.startPolling(1000);

              return _context5.abrupt("return", true);

            case 12:
              return _context5.abrupt("return", false);

            case 13:
              _context5.next = 18;
              break;

            case 15:
              _context5.prev = 15;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 15]]);
    }))();
  },
  addExit: function addExit() {
    var _this5 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var side, position, qty, order;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              side = 'sell';
              position = positions.find(function (sym) {
                return sym.symbol === _this5.symbol;
              });
              qty = position.qty;
              _context6.next = 6;
              return makeOrder(qty, side);

            case 6:
              order = _context6.sent;

              if (order && order.status == 'filled') {
                _this5.exits.push({
                  dateTime: new Date(),
                  entryPrice: position.avg_entry_price,
                  // bought at
                  exitPrice: order.filled_avg_price,
                  // sold at
                  qty: qty
                });
              }

              _context6.next = 13;
              break;

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](0);
              console.log(_context6.t0);

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 10]]);
    }))();
  },
  startPolling: function startPolling(delay) {
    var _this6 = this;

    delay = delay || 10000;

    if (this.poller) {
      this.stopPolling();
    }

    this.poller = setInterval(function () {
      return _this6.update(_this6);
    }, delay);
  },
  stopPolling: function stopPolling() {
    clearInterval(this.poller);
  },
  init: function init(symbol) {
    var _this7 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _this7.symbol = symbol;

              try {
                _this7.averageVolume = _this7.getAverageVolume();
              } catch (err) {
                console.log(err);
              }

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))();
  }
};
var pdtCash = 25000,
    minPrice = 1,
    maxPrice = 10,
    minAverageVolume = 250000,
    costBasis = 1000;
var cash = 30000,
    tradableSymbols = [],
    positions;
var VolumeRunnerStrategy = {
  scanner: null,
  strategy: {
    name: 'VolumeRunner',
    triggers: {
      entry: [{
        relativeVolume: {
          condition: 'gte',
          value: 1
        }
      }, {
        isHOD: {
          condition: 'is',
          value: true
        }
      }],
      exit: [{
        price: {
          condition: 'lt',
          value: 'highOfDay'
        }
      }]
    }
  },
  createTradableSymbols: function createTradableSymbols() {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var polyTickers, alpTickers, averageVolumePromises, response, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop, _iterator3, _step3, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, symbol;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              averageVolumePromises = [];
              _context8.prev = 1;
              console.log('Getting current ticker data...');
              _context8.next = 5;
              return _polygon.polygonSDK.allTickers();

            case 5:
              response = _context8.sent;
              polyTickers = response.data;
              _context8.next = 12;
              break;

            case 9:
              _context8.prev = 9;
              _context8.t0 = _context8["catch"](1);
              console.log(_context8.t0);

            case 12:
              console.log('Success.');
              _context8.prev = 13;
              console.log('Getting current asset data...');
              _context8.next = 17;
              return _alpaca.PaperAlpaca.getAssets();

            case 17:
              alpTickers = _context8.sent;
              _context8.next = 23;
              break;

            case 20:
              _context8.prev = 20;
              _context8.t1 = _context8["catch"](13);
              console.log(_context8.t1);

            case 23:
              console.log('Success.');
              console.log('Filtering symbols...');
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context8.prev = 28;

              _loop = function _loop() {
                var ticker = _step3.value;
                var index = alpTickers.findIndex(function (el) {
                  return el.symbol == ticker.ticker;
                });

                if (index > -1 && alpTickers[index].tradable && ticker.lastTrade['p'] >= minPrice && ticker.lastTrade['p'] <= maxPrice && ticker.prevDay['v'] >= 200000 // TODO: This number isn't based on anything
                ) {
                    var newSymbol = _lodash["default"].cloneDeep(_Symbol);

                    try {
                      newSymbol.init(alpTickers[index].symbol);
                    } catch (err) {
                      console.log(err);
                    }

                    averageVolumePromises.push(newSymbol.averageVolume);
                    tradableSymbols.push(newSymbol);
                  }
              };

              for (_iterator3 = polyTickers.tickers[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                _loop();
              }

              _context8.next = 37;
              break;

            case 33:
              _context8.prev = 33;
              _context8.t2 = _context8["catch"](28);
              _didIteratorError3 = true;
              _iteratorError3 = _context8.t2;

            case 37:
              _context8.prev = 37;
              _context8.prev = 38;

              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }

            case 40:
              _context8.prev = 40;

              if (!_didIteratorError3) {
                _context8.next = 43;
                break;
              }

              throw _iteratorError3;

            case 43:
              return _context8.finish(40);

            case 44:
              return _context8.finish(37);

            case 45:
              _context8.next = 47;
              return Promise.all(averageVolumePromises);

            case 47:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context8.prev = 50;
              _iterator4 = tradableSymbols[Symbol.iterator]();

            case 52:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context8.next = 66;
                break;
              }

              symbol = _step4.value;
              _context8.prev = 54;
              _context8.next = 57;
              return symbol.setAverageVolume();

            case 57:
              if (symbol.averageVolume >= minAverageVolume) {
                symbol.startPolling();
              }

              _context8.next = 63;
              break;

            case 60:
              _context8.prev = 60;
              _context8.t3 = _context8["catch"](54);
              console.log(_context8.t3);

            case 63:
              _iteratorNormalCompletion4 = true;
              _context8.next = 52;
              break;

            case 66:
              _context8.next = 72;
              break;

            case 68:
              _context8.prev = 68;
              _context8.t4 = _context8["catch"](50);
              _didIteratorError4 = true;
              _iteratorError4 = _context8.t4;

            case 72:
              _context8.prev = 72;
              _context8.prev = 73;

              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }

            case 75:
              _context8.prev = 75;

              if (!_didIteratorError4) {
                _context8.next = 78;
                break;
              }

              throw _iteratorError4;

            case 78:
              return _context8.finish(75);

            case 79:
              return _context8.finish(72);

            case 80:
              console.log('Success.');

            case 81:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[1, 9], [13, 20], [28, 33, 37, 45], [38,, 40, 44], [50, 68, 72, 80], [54, 60], [73,, 75, 79]]);
    }))();
  },

  get tradableFunds() {
    return cash - pdtCash;
  },

  symbolScanner: function symbolScanner(self) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var response, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, symbol;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (!(self.tradableFunds < costBasis)) {
                _context9.next = 2;
                break;
              }

              return _context9.abrupt("return");

            case 2:
              _context9.prev = 2;
              _context9.next = 5;
              return _alpaca["default"].getClock();

            case 5:
              response = _context9.sent;

              if (response.is_open) {
                _context9.next = 9;
                break;
              }

              console.log('NOT OPEN');
              return _context9.abrupt("return");

            case 9:
              _context9.next = 14;
              break;

            case 11:
              _context9.prev = 11;
              _context9.t0 = _context9["catch"](2);
              console.log(_context9.t0);

            case 14:
              console.log("Scanning for ".concat(self.strategy.name));
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context9.prev = 18;

              for (_iterator5 = tradableSymbols[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                symbol = _step5.value;
                symbol.lookForEntry(self.strategy);
              }

              _context9.next = 26;
              break;

            case 22:
              _context9.prev = 22;
              _context9.t1 = _context9["catch"](18);
              _didIteratorError5 = true;
              _iteratorError5 = _context9.t1;

            case 26:
              _context9.prev = 26;
              _context9.prev = 27;

              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }

            case 29:
              _context9.prev = 29;

              if (!_didIteratorError5) {
                _context9.next = 32;
                break;
              }

              throw _iteratorError5;

            case 32:
              return _context9.finish(29);

            case 33:
              return _context9.finish(26);

            case 34:
              console.log('Finished scanning for Volume Runners');

            case 35:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[2, 11], [18, 22, 26, 34], [27,, 29, 33]]);
    }))();
  },
  init: function init() {
    var _this8 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _this8.createTradableSymbols();

            case 2:
              _this8.scanner = setInterval(function () {
                return _this8.symbolScanner(_this8);
              }, 3000);

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }))();
  }
};
setInterval(
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee11() {
  return regeneratorRuntime.wrap(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return _alpaca["default"].getPositions();

        case 3:
          positions = _context11.sent;
          _context11.next = 9;
          break;

        case 6:
          _context11.prev = 6;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  }, _callee11, null, [[0, 6]]);
})), 1000);
VolumeRunnerStrategy.init(); // const strategy = {
//     volume_runner: {
//         name:                       'volume_runner',
//         properties: {
//             symbols:                '',             // Array of symbol objects
//             status:                 'out',          // Should be either in or out
//             previous_trigger:       null,           // Should be either 'first_entry' or the price that triggered the action
//         },
//         screen_conditions: {
//             min_price: .5,
//             maxPrice: 5
//         },
//         triggers: {
//             first_entry: {
//                 price:              {condition: 'lte', value: 1},
//                 relative_volume:    {condition: 'gte', value: 1},
//                 average_volume:     {condition: 'gte', value: 250000},
//                 high_of_day:        'true'
//             },
//             exit: {
//                 price: {condition: 'lte', value: 'max_price - 0.1'} // '-0.1'
//             },
//             entry: {
//                 price: {condition: 'gte', value: 1},
//             },
//         },
//     }
// }
// const symbol = {
//     ticker: '',
//     price: 0,
//     max_price: 0,
//     in_at: 0,
//     out_at: 0,
//     dip: 0
// }