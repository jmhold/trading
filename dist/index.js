"use strict";

var _stocktwits = _interopRequireDefault(require("./controllers/stocktwits"));

var _alpaca = _interopRequireDefault(require("./controllers/alpaca"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log('starting trade app');

_stocktwits["default"].init();

_alpaca["default"].init();

var appLoop = function appLoop() {
  _stocktwits["default"].getMessages();

  _alpaca["default"].getPositions();
};

setInterval(appLoop, 60000);