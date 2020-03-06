"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _exports = require("../lib/exports");

var _users = _interopRequireDefault(require("../models/users.model"));

var _messages = _interopRequireDefault(require("../models/messages.model"));

var _stocktwits = _interopRequireDefault(require("../lib/stocktwits.api"));

var _alpaca = _interopRequireDefault(require("./alpaca"));

var _alerts = require("../lib/alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = {
  init: function init() {
    var _this = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('StockTwits Init'); // await this.getFollowing()

              _context.next = 3;
              return _this.seedUser();

            case 3:
              // This is here until better message searching can be achieved
              _this.getMessages();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  seedUser: function seedUser() {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var response, user, existingUser, newUser;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _stocktwits["default"].get('streams/user/' + 1702156 + '.json');

            case 3:
              response = _context2.sent;
              user = response.data.user;
              existingUser = null;
              _context2.next = 8;
              return _users["default"].findOne({
                id: user.id
              }, function (err, doc) {
                existingUser = doc;
              }).exec();

            case 8:
              if (!existingUser) {
                newUser = new _users["default"]({
                  id: user.id,
                  name: user.username,
                  messages: [],
                  latestMsgId: 0
                });

                try {
                  newUser.save();
                } catch (error) {
                  console.log(error);
                }
              }

              _context2.next = 14;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);

              _exports.utils.handleErrors(_context2.t0);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 11]]);
    }))();
  },
  // async getFollowing() { TODO: Needs refactoring
  //     let response = null;
  //     try {
  //         response = await StkTwts.get(
  //             'graph/following.json',
  //             {
  //                 params: {
  //                     access_token: STKTWTS_API_ACCESS_TOKEN
  //                 }
  //             })
  //     } catch (error) {
  //         utils.handleErrors(error)
  //     }
  //     let followedUsers = response.data.users
  //     for(let i in followedUsers)
  //     {
  //         if(!following.find({id: followedUsers[i].id}).value())
  //         {
  //             following.push(
  //                 {
  //                     id: followedUsers[i].id,
  //                     name: followedUsers[i].username,
  //                     messages: []
  //                 }).write()
  //         }
  //     }
  // },
  getMessages: function getMessages() {
    var _this2 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var users, i, msgParams, response;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _users["default"].find({}, function (err, doc) {
                return doc;
              }).exec();

            case 2:
              users = _context3.sent;
              _context3.t0 = regeneratorRuntime.keys(users);

            case 4:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 21;
                break;
              }

              i = _context3.t1.value;
              console.log('Getting new messages from StockTwits for: ' + users[i].name);
              console.log('latestMsgId: ' + users[i].latestMsgId);
              msgParams = users[i].messages.length > 0 ? {
                since: users[i].latestMsgId
              } : {};
              _context3.prev = 9;
              _context3.next = 12;
              return _stocktwits["default"].get('streams/user/' + users[i].id + '.json', {
                params: msgParams
              });

            case 12:
              response = _context3.sent;

              if (response && response.data && response.data.messages) {
                _this2.pruneMessages(users[i].id, response.data.messages);
              }

              _context3.next = 19;
              break;

            case 16:
              _context3.prev = 16;
              _context3.t2 = _context3["catch"](9);

              _exports.utils.handleErrors(_context3.t2);

            case 19:
              _context3.next = 4;
              break;

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[9, 16]]);
    }))();
  },
  pruneMessages: function pruneMessages(userID, msgs) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var userDoc, msgDocs, alertIndex, buyAlert, newAlerts, i, msgDoc;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _users["default"].findOne({
                id: userID
              }, function (err, doc) {
                return doc;
              }).exec();

            case 2:
              userDoc = _context4.sent;

              if (userDoc) {
                _context4.next = 6;
                break;
              }

              console.log('Prune Msgs couldn\'t find user id: ' + userId);
              return _context4.abrupt("return");

            case 6:
              msgDocs = userDoc.messages;
              alertIndex = _lodash["default"].findIndex(_alerts.alerts, {
                id: userID
              });
              buyAlert = alertIndex >= 0 ? _alerts.alerts[alertIndex].alert : _alerts.alerts[0].alert;
              newAlerts = false;
              console.log('Running Prune Messages');

              for (i in msgs) {
                msgDoc = _lodash["default"].findIndex(msgDocs, {
                  id: msgs[i].id
                });

                if (msgs[i].body.match(buyAlert) && msgs[i].symbols && !msgDoc >= 0) {
                  newAlerts = true;
                  console.log("Adding Msg:");
                  console.log(msgs[i].body);
                  msgDocs.push(new _messages["default"]({
                    id: msgs[i].id,
                    body: msgs[i].body,
                    symbols: msgs[i].symbols,
                    created: msgs[i].created_at
                  }));

                  _alpaca["default"].newMsgSymbols(userDoc.name, msgs[i].symbols);
                }

                userDoc.latestMsgId = msgs[i].id > userDoc.latestMsgId ? msgs[i].id : userDoc.latestMsgId;
              }

              _context4.next = 14;
              return userDoc.save();

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  }
};
exports["default"] = _default;