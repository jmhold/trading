"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alerts = void 0;
const alerts = [{
  // default
  // alert: /\$[A-Z]{2,4}(.* ([B,b]uying here|[A,a]dding here|[O,o]pening here))/g
  alert: /^\$[A-Z]{2,4}/g // (.* ([B,b](ought|uying)|[A,a]dd(ed|ing)|[O,o]pen(ed|ing)))

}, {
  id: 1702156,
  alert: /^\$[A-Z]{2,4}.*(([B,b]uying|[A,a]dding|[O,o]pening|[H,h]olding) {1,6}([H,h]ere|[M,m]ore))|([B,b]uy [A,a]lert)/g,
  maybe: /(sleep on this)/g
}];
exports.alerts = alerts;