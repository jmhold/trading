"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stk = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _exports = require("./exports");

var _alpaca = require("./alpaca");

var _alerts = require("./lib/alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let following = _exports.db.get('following');

const stk = {
  async init() {
    console.log('StockTwits Init'); // await this.getFollowing()

    await this.seedUser(); // This is here until better message searching can be achieved

    this.getMessages();
    following.write();
  },

  async seedUser() {
    // This is here until better message searching can be achieved
    console.log('Seed User');

    try {
      const response = await _exports.stkAPI.get('streams/user/' + 1702156 + '.json');
      const user = response.data.user;

      if (!following.find({
        id: user.id
      }).value()) {
        following.push({
          id: user.id,
          name: user.username,
          messages: [],
          latestMsgId: 0
        }).write();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getFollowing() {
    let response = null;

    try {
      response = await _exports.stkAPI.get('graph/following.json', {
        params: {
          access_token: _exports.STKTWTS_API_ACCESS_TOKEN
        }
      });
    } catch (error) {
      console.log(error);
    }

    let followedUsers = response.data.users;

    for (let i in followedUsers) {
      if (!following.find({
        id: followedUsers[i].id
      }).value()) {
        following.push({
          id: followedUsers[i].id,
          name: followedUsers[i].username,
          messages: []
        }).write();
      }
    }
  },

  async getMessages() {
    const users = following.value();

    for (let i in users) {
      try {
        console.log('Getting new messages from StockTwits for: ' + users[i].name);
        const msgParams = users[i].messages.length ? {
          since: users[i].latestMsgId
        } : {};
        const response = await _exports.stkAPI.get('streams/user/' + users[i].id + '.json', {
          params: msgParams
        });

        if (response && response.data && response.data.messages) {
          if (this.pruneMessages(users[i].id, response.data.messages)) {
            _alpaca.alp.newMsgs(users[i].id, users[i].latestMsgId);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },

  pruneMessages(userID, msgs) {
    const user = following.find({
      id: userID
    });

    const alertIndex = _lodash.default.findIndex(_alerts.alerts, {
      id: userID
    });

    const buyAlert = alertIndex >= 0 ? _alerts.alerts[alertIndex].alert : _alerts.alerts[0].alert;
    let newAlerts = false;
    console.log('Running Prune Messages');

    for (let i in msgs) {
      if (msgs[i].body.match(buyAlert) && msgs[i].symbols && user.get('messages').find({
        id: msgs[i].id
      }).value() == undefined) {
        newAlerts = true;
        following.find({
          id: userID
        }).get('messages').push({
          id: msgs[i].id,
          body: msgs[i].body,
          symbols: msgs[i].symbols,
          created: msgs[i].created_at
        }).write();
      }
    }

    return newAlerts;
  }

};
exports.stk = stk;