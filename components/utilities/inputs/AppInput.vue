<template>
  <div
    :class="[baseContainer]"
    class="relative text-xs track-lead-0 input-base-container"
  >
    <div class="text-sm font-bold leading-snug text-black mb-1">
      {{ label }}
    </div>

    <input
      :id="id"
      v-bind="$attrs"
      :value="value"
      :type="inputType"
      :class="[resolvedInputTheme, focusTheme]"
      class="input-base"
      :placeholder="placeholder"
      :required="required"
      @input="emitInput($event.target.value)"
      @blur="emitBlur"
      @keydown.enter.prevent="emitEnter($event.target.value)"
    />

    <p v-if="focusHint && focusHintVisible" class="mt-1 hint-text">
      {{ focusHint }}
    </p>

    <!-- error flag -->
    <!-- <AppInputError
      v-if="error"
      :error-content="errorContent"
      :error-slot="errorSlot"
      :error="error"
      :error-required="errorRequired"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'AppInput',

  inheritAttrs: false,

  props: {
    // combined
    value: {
      type: [String, Number, Array, Object],
      default: null,
    },

    //   strings
    container: {
      type: String,
      default: null,
    },

    inputType: {
      type: String,
      default: 'text',
    },

    inputTheme: {
      type: String,
      default: 'WFBGBB',
    },

    focusTheme: {
      type: String,
      default: 'yellow-outline',
    },

    label: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: null,
    },

    errorContent: {
      type: String,
      default: null,
    },

    hint: {
      type: String,
      default: null,
    },

    focusHint: {
      type: String,
      default: null,
    },

    // booleans
    butttonThemeAbbv: {
      type: Boolean,
      default: true,
    },

    lightLabel: {
      type: Boolean,
      default: false,
    },

    required: {
      type: Boolean,
      default: false,
    },

    errorRequired: {
      type: Boolean,
      default: false,
    },

    error: {
      type: Boolean,
      default: false,
    },

    hintSlot: {
      type: Boolean,
      default: false,
    },

    errorSlot: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      id: null,
      focusHintVisible: false,
    }
  },

  computed: {
    resolvedInputTheme() {
      //   resolve theme to class names if required
      if (!this.butttonThemeAbbv) {
        return this.inputTheme
      } else {
        let className
        switch (this.inputTheme) {
          case 'BGFWBB':
            className = 'brand-gray-fill-white-bottom-border'
            break

          default:
            className = 'white-fill-brand-gray-bottom-border'
            break
        }

        return className
      }
    },

    baseContainer() {
      return this.container
    },
  },

  mounted() {
    this.id = this.$uuid()
  },

  methods: {
    emitInput(e) {
      if (!this.focusHint) {
        this.$emit('input', e)
      } else {
        this.$emit('input', e)
        e ? (this.focusHintVisible = true) : (this.focusHintVisible = false)
      }
    },

    emitBlur(e) {
      this.focusHintVisible = false
      this.$emit('blur', e)
    },

    emitEnter(e) {
      this.$emit('enter')
    },
  },
}
</script>

<style lang="postcss" scoped>
.input-base-container {
  @apply tracking-tight leading-tight;
}

/* resrt ios date input styles */
.input-base[type='date'] {
  display: block;
  min-height: 41px;
  max-height: 41px;
}

.input-base,
.input-base[type='text'],
.input-base[type='email'],
.input-base[type='date'],
.input-base[type='password'] {
  /* remove webkit default style */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* input style */
  @apply relative py-3 w-full px-4 rounded-full transition-shadow ease-in-out;
  &:focus {
    @apply outline-none shadow-lg;
  }
}

/* themes */

/* Input Themes */

/* Button Theme WFBGBB */
.white-fill-brand-gray-bottom-border {
  @apply text-black border border-app-gray-550;
  &:focus {
    /* @apply border-brand-gray; */
  }
}

/* Button Theme BGFWBB */
.brand-gray-fill-white-bottom-border {
  @apply text-white border border-opacity-25 border-b-white bg-app-gray-550;
  &:focus {
    @apply border-white;
  }
}
</style>
