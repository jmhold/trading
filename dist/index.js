"use strict";

var _exports = require("./exports");

var _stocktwits = require("./stocktwits");

var _alpaca = require("./alpaca");

console.log('starting trade app');

_stocktwits.stk.init();

_alpaca.alp.init();

const appLoop = function appLoop() {
  _stocktwits.stk.getMessages();
};

setInterval(appLoop, 60000);