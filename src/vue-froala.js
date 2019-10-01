import FroalaEditor from 'froala-editor'

const froalaEditor = {

  props: ['tag', 'value', 'config', 'onManualControllerReady'],

  watch: {
    value () {
      this.model = this.value
      this.updateValue()
    }
  },

  render (createElement) {
    return createElement(
      this.currentTag,
      [this.$slots.default]
    )
  },

  created () {
    this.currentTag = this.tag || this.currentTag
    this.model = this.value
  },

  // After first time render.
  mounted () {
    if (this.SPECIAL_TAGS.indexOf(this.currentTag) !== -1) {

      this.hasSpecialTag = true
    }

    if (this.onManualControllerReady) {
      this.generateManualController()
    } else {
      this.createEditor()
    }
  },

  beforeDestroy () {
    this.destroyEditor()
  },

  data () {

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
    }
  },
  methods: {
    updateValue () {
      if (JSON.stringify(this.oldModel) === JSON.stringify(this.model)) {
        return
      }

      this.setContent()
    },

    createEditor () {

      if (this.editorInitialized) {
        return
      }

      this.currentConfig = this.config || this.defaultConfig

      this.setContent(true)

      // Bind editor events.
      this.registerEvents()
      this.initListeners()

      this._editor = new FroalaEditor(this.$el, this.currentConfig)
    },

    setContent (firstTime) {

      if (!this.editorInitialized && !firstTime) {
        return
      }

      if (this.model || this.model === '') {

        this.oldModel = this.model

        if (this.hasSpecialTag) {
          this.setSpecialTagContent()
        } else {
          this.setNormalTagContent(firstTime)
        }
      }
    },

    setNormalTagContent (firstTime) {

      var self = this

      function htmlSet () {
        // Check if editor not null
        if (!self._editor) return

        if (self._editor.html !== undefined) {
          self._editor.html.set(self.model || '')
        }

        //This will reset the undo stack everytime the model changes externally. Can we fix this?

        if (self._editor.undo !== undefined) {
          self._editor.undo.saveStep()
          self._editor.undo.reset()
        }
      }

      if (firstTime) {
        this.registerEvent('initialized', function () {
          htmlSet()
        })
      } else {
        htmlSet()
      }

    },

    setSpecialTagContent () {

      const tags = this.model

      // add tags on element
      if (tags) {

        for (const attr in tags) {
          if (tags.hasOwnProperty(attr) && attr !== this.INNER_HTML_ATTR) {
            this.$el.setAttribute(attr, tags[attr])
          }
        }

        if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
          this.$el.innerHTML = tags[this.INNER_HTML_ATTR]
        }
      }
    },

    destroyEditor () {

      if (this._editor) {
        this.initEvents = []
        this._editor.destroy()
        this.editorInitialized = false
        this._editor = null
      }
    },

    getEditor () {
      return this._editor
    },

    generateManualController () {

      const controls = {
        initialize: this.createEditor,
        destroy: this.destroyEditor,
        getEditor: this.getEditor
      }

      this.onManualControllerReady(controls)
    },

    updateModel () {

      let modelContent = ''

      if (this.hasSpecialTag) {

        const attributeNodes = this.$el[0].attributes
        const attrs = {}

        let i
        for (i = 0; i < attributeNodes.length; i++) {

          const attrName = attributeNodes[i].name
          if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) !== -1) {
            continue
          }
          attrs[attrName] = attributeNodes[i].value
        }

        if (this.$el[0].innerHTML) {
          attrs[this.INNER_HTML_ATTR] = this.$el[0].innerHTML
        }

        modelContent = attrs
      } else {

        const returnedHtml = this._editor.html.get()
        if (typeof returnedHtml === 'string') {
          modelContent = returnedHtml
        }
      }

      this.oldModel = modelContent
      this.$emit('input', modelContent)
    },

    initListeners () {
      this.registerEvent('initialized', () => {
        this.editorInitialized = true

        if (this._editor.events) {
          // bind contentChange and keyup event to froalaModel
          this._editor.events.on('contentChanged', () => {
            this.updateModel()
          })
          if (this.currentConfig.immediateVueModelUpdate) {
            this._editor.events.on('keyup', () => {
              this.updateModel()
            })
          }
        }
      })
    },

    // register event on editor element
    registerEvent (eventName, callback) {

      if (!eventName || !callback) {
        return
      }

      // Initialized event.
      if (eventName === 'initialized') {

        this.initEvents.push(callback)
      } else {
        if (!this.currentConfig.events) {
          this.currentConfig.events = {}
        }
        this.currentConfig.events[eventName] = callback
      }
    },

    registerEvents () {
      // Handle initialized on its own.
      this.registerInitialized()

      // Get current events.
      const events = this.currentConfig.events

      if (!events) {
        return
      }

      for (var event in events) {
        if (events.hasOwnProperty(event) && event !== 'initialized') {
          this.registerEvent(event, events[event])
        }
      }
    },

    registerInitialized () {
      // Bind initialized.
      if (!this.currentConfig.events) {
        this.currentConfig.events = {}
      }

      // Set original initialized event.
      if (this.currentConfig.events.initialized) {
        this.registerEvent('initialized', this.currentConfig.events.initialized)
      }

      // Bind initialized event.
      this.currentConfig.events.initialized = () => {
        for (var i = 0; i < this.initEvents.length; i++) {
          this.initEvents[i].call(this._editor)
        }
      }
    }
  }
}

const froalaView = {

  props: ['tag', 'value'],

  watch: {
    value (newValue) {
      this._element.innerHTML = newValue
    }
  },

  computed: {
    currentTag () {
      return this.tag || 'div'
    }
  },

  render (createElement) {
    return createElement(
      this.currentTag,
      {
        class: 'fr-view'
      }
    )
  },

  // After first time render.
  mounted () {
    this._element = this.$el

    if (this.value) {
      this._element.innerHTML = this.value
    }
  },

  data () {

    return {
      _element: null
    }
  }
}

export { froalaEditor, froalaView }
