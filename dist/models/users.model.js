"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _messages = require("./messages.model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = _mongoose.default.Schema({
  id: Number,
  name: String,
  messages: [_messages.msgSchema],
  latestMsgId: Number
});

let usersModel = _mongoose.default.model('User', userSchema);

var _default = usersModel;
exports.default = _default;