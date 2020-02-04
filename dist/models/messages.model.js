"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.msgSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const msgSchema = _mongoose.default.Schema({
  id: Number,
  body: String,
  symbols: [],
  created: Date
});

exports.msgSchema = msgSchema;

let msgsModel = _mongoose.default.model('Message', msgSchema);

var _default = msgsModel;
exports.default = _default;