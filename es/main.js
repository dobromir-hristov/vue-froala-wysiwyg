"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./examples/App"));

var _src = _interopRequireDefault(require("src"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// supports both of Vue 1.0 and Vue 2.0
require('froala-editor/js/froala_editor.pkgd.min');

require("froala-editor/css/froala_editor.pkgd.min.css");

require('font-awesome/css/font-awesome.css');

require('froala-editor/css/froala_style.min.css');

_vue.default.use(_src.default);

new _vue.default({
  render: function render(h) {
    return h(_App.default);
  }
}).$mount('#app');