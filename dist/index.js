"use strict";

var _stocktwits = _interopRequireDefault(require("./stocktwits"));

var _alpaca = _interopRequireDefault(require("./alpaca"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('starting trade app');

_stocktwits.default.init();

_alpaca.default.init();

const appLoop = function appLoop() {
  _stocktwits.default.getMessages();
};

setInterval(appLoop, 60000);