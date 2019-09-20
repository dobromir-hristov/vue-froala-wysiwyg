'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var FroalaEditor = _interopDefault(require('froala-editor'));

var froalaEditor = {
  props: ['tag', 'value', 'config', 'onManualControllerReady'],
  watch: {
    value: function value() {
      this.model = this.value;
      this.updateValue();
    }
  },
  render: function render(createElement) {
    return createElement(this.currentTag, [this.$slots["default"]]);
  },
  created: function created() {
    this.currentTag = this.tag || this.currentTag;
    this.model = this.value;
  },
  // After first time render.
  mounted: function mounted() {
    if (this.SPECIAL_TAGS.indexOf(this.currentTag) !== -1) {
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
      initEvents: [],
      // Tag on which the editor is initialized.
      currentTag: 'div',
      // Editor element.
      _editor: null,
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
      if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
        return;
      }

      this.setContent();
    },
    createEditor: function createEditor() {
      if (this.editorInitialized) {
        return;
      }

      this.currentConfig = this.config || this.defaultConfig;
      this.setContent(true); // Bind editor events.

      this.registerEvents();
      this.initListeners();
      this._editor = new FroalaEditor(this.$el, this.currentConfig);
      this.editorInitialized = true;
    },
    setContent: function setContent(firstTime) {
      if (!this.editorInitialized && !firstTime) {
        return;
      }

      if (this.model || this.model === '') {
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
        self._editor.html.set(self.model || ''); //This will reset the undo stack everytime the model changes externally. Can we fix this?


        self._editor.undo.saveStep();

        self._editor.undo.reset();
      }

      if (firstTime) {
        this.registerEvent('initialized', function () {
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
          if (tags.hasOwnProperty(attr) && attr !== this.INNER_HTML_ATTR) {
            this.$el.setAttribute(attr, tags[attr]);
          }
        }

        if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
          this.$el.innerHTML = tags[this.INNER_HTML_ATTR];
        }
      }
    },
    destroyEditor: function destroyEditor() {
      if (this._editor) {
        this._editor.destroy();

        this.editorInitialized = false;
        this._editor = null;
      }
    },
    getEditor: function getEditor() {
      return this._editor;
    },
    generateManualController: function generateManualController() {
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
        var attributeNodes = this.$el[0].attributes;
        var attrs = {};
        var i;

        for (i = 0; i < attributeNodes.length; i++) {
          var attrName = attributeNodes[i].name;

          if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) !== -1) {
            continue;
          }

          attrs[attrName] = attributeNodes[i].value;
        }

        if (this.$el[0].innerHTML) {
          attrs[this.INNER_HTML_ATTR] = this.$el[0].innerHTML;
        }

        modelContent = attrs;
      } else {
        var returnedHtml = this._editor.html.get();

        if (typeof returnedHtml === 'string') {
          modelContent = returnedHtml;
        }
      }

      this.oldModel = modelContent;
      this.$emit('input', modelContent);
    },
    initListeners: function initListeners() {
      var _this = this;

      this.registerEvent('initialized', function () {
        if (_this._editor.events) {
          // bind contentChange and keyup event to froalaModel
          _this._editor.events.on('contentChanged', function () {
            _this.updateModel();
          });

          if (_this.currentConfig.immediateVueModelUpdate) {
            _this._editor.events.on('keyup', function () {
              _this.updateModel();
            });
          }
        }
      });
    },
    // register event on editor element
    registerEvent: function registerEvent(eventName, callback) {
      if (!eventName || !callback) {
        return;
      } // Initialized event.


      if (eventName === 'initialized') {
        this.initEvents.push(callback);
      } else {
        if (!this.currentConfig.events) {
          this.currentConfig.events = {};
        }

        this.currentConfig.events[eventName] = callback;
      }
    },
    registerEvents: function registerEvents() {
      // Handle initialized on its own.
      this.registerInitialized(); // Get current events.

      var events = this.currentConfig.events;

      if (!events) {
        return;
      }

      for (var event in events) {
        if (events.hasOwnProperty(event) && event !== 'initialized') {
          this.registerEvent(event, events[event]);
        }
      }
    },
    registerInitialized: function registerInitialized() {
      var _this2 = this;

      // Bind initialized.
      if (!this.currentConfig.events) {
        this.currentConfig.events = {};
      } // Set original initialized event.


      if (this.currentConfig.events.initialized) {
        this.registerEvent('initialized', this.currentConfig.events.initialized);
      } // Bind initialized event.


      this.currentConfig.events.initialized = function () {
        for (var i = 0; i < _this2.initEvents.length; i++) {
          _this2.initEvents[i].call(_this2._editor);
        }
      };
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
  computed: {
    currentTag: function currentTag() {
      return this.tag || 'div';
    }
  },
  render: function render(createElement) {
    return createElement(this.currentTag, {
      "class": 'fr-view'
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
      _element: null
    };
  }
};

var index = (function (Vue) {
  Vue.component("Froala", froalaEditor);
  Vue.component("FroalaView", froalaView);
});

exports.default = index;
exports.froalaEditor = froalaEditor;
exports.froalaView = froalaView;
