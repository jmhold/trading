"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _stocktwits = _interopRequireDefault(require("../../lib/stocktwits.api"));

var _alerts = require("../../lib/alerts");

var _exports = require("../../exports");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a date object 3 months in the past
let btDate = new Date();
btDate.setMonth(btDate.getMonth() - 3);
let messages = [];
let userID = 1702156;
let trackLowestID = null;
let msgDateTracker = new Date();
let callCounter = 0;
const backtest = {
  init() {},

  async getMsgs() {
    const msgParams = messages.length && trackLowestID ? {
      max: trackLowestID
    } : {};
    callCounter++;

    try {
      const response = await _stocktwits.default.get('streams/user/' + userID + '.json', {
        params: msgParams
      });

      if (response && response.data && response.data.messages) {
        this.pruneNewMessages(userID, response.data.messages);
      }
    } catch (error) {
      _exports.utils.handleErrors(error);
    }
  },

  pruneNewMessages(userID, msgs) {
    const alertIndex = _lodash.default.findIndex(_alerts.alerts, {
      id: userID
    });

    const buyAlert = alertIndex >= 0 ? _alerts.alerts[alertIndex].alert : _alerts.alerts[0].alert;
    console.log('Running Prune Messages');

    for (let i in msgs) {
      if (msgs[i].body.match(buyAlert) && msgs[i].symbols) {
        console.log('prune for loop');
        messages.push({
          id: msgs[i].id,
          body: msgs[i].body,
          symbols: msgs[i].symbols,
          created: msgs[i].created_at
        });
      }
    }

    this.lowestID();
  },

  lowestID() {
    if (!trackLowestID && messages.length) {
      trackLowestID = messages[0].id;
      return;
    }

    if (messages) {
      for (let i in messages) {
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