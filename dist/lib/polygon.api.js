"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Polygon API
const PLY_API_BASE_URL = 'https://api.polygon.io/';

var _default = _axios.default.create({
  baseURL: PLY_API_BASE_URL
});

exports.default = _default;