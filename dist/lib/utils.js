"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  compare: function compare(condition, a, b) {
    switch (condition) {
      case 'gte':
        return a >= b;

      case 'lte':
        return a <= b;

      case 'gt':
        return a > b;

      case 'lt':
        return a < b;

      case 'is':
        return a === b;
    }
  },
  gte: function gte(a, b) {
    return a >= b;
  },
  lte: function lte(a, b) {
    return a <= b;
  },
  gt: function gt(a, b) {
    return a > b;
  },
  lt: function lt(a, b) {
    return a < b;
  }
};
exports["default"] = _default;