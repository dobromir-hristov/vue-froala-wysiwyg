(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("vue-froala-wysiwyg", [], factory);
	else if(typeof exports === 'object')
		exports["vue-froala-wysiwyg"] = factory();
	else
		root["vue-froala-wysiwyg"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "froalaEditor", function() { return froalaEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "froalaView", function() { return froalaView; });
var froalaEditor = {
  props: ['tag', 'value', 'config', 'onManualControllerReady'],
  watch: {
    value: function value() {
      this.model = this.value;
      this.updateValue();
    }
  },
  render: function render(createElement) {
    return createElement(this.currentTag, [this.$slots.default]);
  },
  created: function created() {
    this.currentTag = this.tag || this.currentTag;
    this.model = this.value;
  },
  // After first time render.
  mounted: function mounted() {
    if (this.SPECIAL_TAGS.indexOf(this.currentTag) != -1) {
      this.hasSpecialTag = true;
    }

    if (this.onManualControllerReady) {
      this.generateManualController();
    } else {
      this.createEditor();
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.destroyEditor();
  },
  data: function data() {
    return {
      // Tag on which the editor is initialized.
      currentTag: 'div',
      listeningEvents: [],
      // Jquery wrapped element.
      _$element: null,
      // Editor element.
      _$editor: null,
      // Current config.
      currentConfig: null,
      // Editor options config
      defaultConfig: {
        immediateVueModelUpdate: false,
        vueIgnoreAttrs: null
      },
      editorInitialized: false,
      SPECIAL_TAGS: ['img', 'button', 'input', 'a'],
      INNER_HTML_ATTR: 'innerHTML',
      hasSpecialTag: false,
      model: null,
      oldModel: null
    };
  },
  methods: {
    updateValue: function updateValue() {
      if (JSON.stringify(this.oldModel) == JSON.stringify(this.model)) {
        return;
      }

      this.setContent();
    },
    createEditor: function createEditor() {
      if (this.editorInitialized) {
        return;
      }

      this.currentConfig = this.config || this.defaultConfig;
      this._$element = jQuery(this.$el);
      this.setContent(true);
      this.registerEvents();
      this._$editor = this._$element.froalaEditor(this.currentConfig).data('froala.editor').$el;
      this.initListeners();
      this.editorInitialized = true;
    },
    setContent: function setContent(firstTime) {
      if (!this.editorInitialized && !firstTime) {
        return;
      }

      if (this.model || this.model == '') {
        this.oldModel = this.model;

        if (this.hasSpecialTag) {
          this.setSpecialTagContent();
        } else {
          this.setNormalTagContent(firstTime);
        }
      }
    },
    setNormalTagContent: function setNormalTagContent(firstTime) {
      var self = this;

      function htmlSet() {
        self._$element.froalaEditor('html.set', self.model || '', true); //This will reset the undo stack everytime the model changes externally. Can we fix this?


        self._$element.froalaEditor('undo.saveStep');

        self._$element.froalaEditor('undo.reset');
      }

      if (firstTime) {
        this.registerEvent(this._$element, 'froalaEditor.initialized', function () {
          htmlSet();
        });
      } else {
        htmlSet();
      }
    },
    setSpecialTagContent: function setSpecialTagContent() {
      var tags = this.model; // add tags on element

      if (tags) {
        for (var attr in tags) {
          if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
            this._$element.attr(attr, tags[attr]);
          }
        }

        if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
          this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
        }
      }
    },
    destroyEditor: function destroyEditor() {
      if (this._$element) {
        this.listeningEvents && this._$element.off(this.listeningEvents.join(" "));

        this._$editor.off('keyup');

        this._$element.froalaEditor('destroy');

        this.listeningEvents.length = 0;
        this._$element = null;
        this.editorInitialized = false;
      }
    },
    getEditor: function getEditor() {
      if (this._$element) {
        return this._$element.froalaEditor.bind(this._$element);
      }

      return null;
    },
    generateManualController: function generateManualController() {
      var self = this;
      var controls = {
        initialize: this.createEditor,
        destroy: this.destroyEditor,
        getEditor: this.getEditor
      };
      this.onManualControllerReady(controls);
    },
    updateModel: function updateModel() {
      var modelContent = '';

      if (this.hasSpecialTag) {
        var attributeNodes = this._$element[0].attributes;
        var attrs = {};

        for (var i = 0; i < attributeNodes.length; i++) {
          var attrName = attributeNodes[i].name;

          if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) != -1) {
            continue;
          }

          attrs[attrName] = attributeNodes[i].value;
        }

        if (this._$element[0].innerHTML) {
          attrs[this.INNER_HTML_ATTR] = this._$element[0].innerHTML;
        }

        modelContent = attrs;
      } else {
        var returnedHtml = this._$element.froalaEditor('html.get');

        if (typeof returnedHtml === 'string') {
          modelContent = returnedHtml;
        }
      }

      this.oldModel = modelContent;
      this.$emit('input', modelContent);
    },
    initListeners: function initListeners() {
      var self = this; // bind contentChange and keyup event to froalaModel

      this.registerEvent(this._$element, 'froalaEditor.contentChanged', function () {
        self.updateModel();
      });

      if (this.currentConfig.immediateVueModelUpdate) {
        this.registerEvent(this._$editor, 'keyup', function () {
          self.updateModel();
        });
      }
    },
    // register event on jquery editor element
    registerEvent: function registerEvent(element, eventName, callback) {
      if (!element || !eventName || !callback) {
        return;
      }

      this.listeningEvents.push(eventName);
      element.on(eventName, callback);
    },
    registerEvents: function registerEvents() {
      var events = this.currentConfig.events;

      if (!events) {
        return;
      }

      for (var event in events) {
        if (events.hasOwnProperty(event)) {
          this.registerEvent(this._$element, event, events[event]);
        }
      }
    }
  }
};
var froalaView = {
  props: ['tag', 'value'],
  watch: {
    value: function value(newValue) {
      this._element.innerHTML = newValue;
    }
  },
  created: function created() {
    this.currentTag = this.tag || this.currentTag;
  },
  render: function render(createElement) {
    return createElement(this.currentTag, {
      class: 'fr-view'
    });
  },
  // After first time render.
  mounted: function mounted() {
    this._element = this.$el;

    if (this.value) {
      this._element.innerHTML = this.value;
    }
  },
  data: function data() {
    return {
      currentTag: 'div',
      _element: null
    };
  }
};


/***/ })
/******/ ]);
});