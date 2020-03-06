"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.posSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var posSchema = _mongoose["default"].Schema({
  active: Boolean,
  symbol: String,
  max_price: Number,
  max_plpc: Number,
  created: Date
});

exports.posSchema = posSchema;

var posModel = _mongoose["default"].model('Position', posSchema);

var _default = posModel;
exports["default"] = _default;