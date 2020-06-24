var Strformat = function () {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }
  return s;
}
var T = function () {
  arguments[0] = chrome.i18n.getMessage(arguments[0]) || arguments[0];
  return Strformat.apply(null, Array.prototype.slice.apply(arguments));
};