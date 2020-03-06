"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _stocktwits = _interopRequireDefault(require("../../lib/stocktwits.api"));

var _alerts = require("../../lib/alerts");

var _exports = require("../../lib/exports");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Create a date object 3 months in the past
var btDate = new Date();
btDate.setMonth(btDate.getMonth() - 3);
var messages = [];
var userID = 1702156;
var trackLowestID = null;
var msgDateTracker = new Date();
var callCounter = 0;
var backtest = {
  init: function init() {},
  getMsgs: function getMsgs() {
    var _this = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var msgParams, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              msgParams = {
                max: 192052807
              }; // const msgParams = (messages.length && trackLowestID) ? 
              //             { max: trackLowestID } : 
              //             {}

              callCounter++;
              _context.prev = 2;
              _context.next = 5;
              return _stocktwits["default"].get('streams/user/' + userID + '.json', {
                params: msgParams
              });

            case 5:
              response = _context.sent;

              if (response && response.data && response.data.messages) {
                // let msgs = response.data.messages;
                // console.log(response.data.messages)
                // console.log(alerts)
                // console.log(_.findIndex(alerts, {id: userID}))
                // console.log(alerts[1].alert)
                // for(let i in msgs)
                // {
                //     console.log(msgs[i].body.match(alerts[1].alert))
                // }
                _this.pruneNewMessages(userID, response.data.messages);
              }

              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](2);

              _exports.utils.handleErrors(_context.t0);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 9]]);
    }))();
  },
  pruneNewMessages: function pruneNewMessages(userID, msgs) {
    var alertIndex = _lodash["default"].findIndex(_alerts.alerts, {
      id: userID
    });

    var buyAlert = alertIndex >= 0 ? _alerts.alerts[alertIndex].alert : _alerts.alerts[0].alert;
    console.log('Running Prune Messages');

    for (var i in msgs) {
      if (msgs[i].body.match(buyAlert) && msgs[i].symbols) {
        console.log('inside ifs');
        console.log(msgs[i].body.match(buyAlert));
        messages.push({
          id: msgs[i].id,
          body: msgs[i].body,
          symbols: msgs[i].symbols,
          created: msgs[i].created_at
        });
      }
    }

    console.log(messages);
    this.lowestID();
  },
  lowestID: function lowestID() {
    if (!trackLowestID && messages.length) {
      trackLowestID = messages[0].id;
      return;
    }

    if (messages) {
      for (var i in messages) {
        if (trackLowestID > messages[i].id) {
          trackLowestID = messages[i].id;
          msgDateTracker = new Date(messages[i].created_at);
        }
      }
    }

    if (msgDateTracker > btDate && callCounter < 200) {
      this.getMsgs();
    } else {
      console.log(messages);
    }
  }
};
backtest.getMsgs();