'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var platform = require('platform');
var isSameStr = function (a, b) {
  return a === b || a.toLowerCase() === b.toLowerCase() || a.toUpperCase() === b.toUpperCase();
};
exports.isMobile = function () {
  var os = platform.os.family;
  return isSameStr(os, 'IOS') || isSameStr(os, 'ANDROID');
};
exports.isIOS = function () {
  return isSameStr(platform.os.family, 'IOS');
};
exports.isAndroid = function () {
  return isSameStr(platform.os.family, 'ANDROID');
};
//# sourceMappingURL=index.js.map
