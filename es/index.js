"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "froalaEditor", {
  enumerable: true,
  get: function get() {
    return _vueFroala.froalaEditor;
  }
});
Object.defineProperty(exports, "froalaView", {
  enumerable: true,
  get: function get() {
    return _vueFroala.froalaView;
  }
});
exports.default = void 0;

var _vueFroala = require("./vue-froala");

var _default = function _default(Vue) {
  var Options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Vue.component("Froala", _vueFroala.froalaEditor);
  Vue.component("FroalaView", _vueFroala.froalaView);
};

exports.default = _default;