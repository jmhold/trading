"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: Number,
  name: String,
  messages: [],
  latestMsgId: Number
});
let usersModel = mongoose.model('User', userSchema);
var _default = usersModel;
exports.default = _default;