"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.posSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const posSchema = _mongoose.default.Schema({
  asset_id: String,
  symbol: String,
  side: String,
  // long or short
  created: Date
});

exports.posSchema = posSchema;

let posModel = _mongoose.default.model('Position', posSchema);

var _default = posModel;
exports.default = _default;