<template>
  <div
    :class="[baseContainer]"
    class="relative text-xs track-lead-0 input-base-container"
  >
    <div v-if="label" class="text-sm font-bold leading-snug text-black mb-1">
      {{ label }}
    </div>
    <div v-on-clickaway="hideDropdown" class="relative">
      <div
        :ref="id"
        class="input-base"
        :class="[resolvedInputTheme, focusTheme]"
      >
        <input
          :id="id"
          v-model="inputLabel"
          :type="inputType"
          :placeholder="placeholder"
          :required="required"
          @focus="showDropdown"
          @keydown.escape="hideDropdown"
          @input="sort = true"
          @keydown.enter.prevent="hideDropdown"
        />

        <div class="flex divide-x-[1px] divide-app-gray-100">
          <span
            v-if="inputValue !== null"
            class="
              flex
              items-center
              justify-center
              px-3
              text-xs
              leading-none
              text-app-gray-550
            "
            role="button"
            @click.prevent="clearSelection"
          >
            <MaterialIcon class="text-sm" icon="close" />
          </span>
          <span
            class="
              flex
              items-center
              justify-center
              px-3
              text-xs
              leading-none
              text-app-gray-550
            "
            role="button"
            @click.prevent="dropdownVisible = !dropdownVisible"
          >
            <MaterialIcon icon="expand_more" />
          </span>
        </div>
      </div>

      <transition name="fade-up">
        <div
          v-show="dropdownVisible"
          :key="optionsKey"
          class="px-1 py-1 overflow-auto rounded-lg select-dropdown"
          :style="[dropdownPosition]"
        >
          <p
            v-if="!filteredItems.length"
            class="px-3 py-3 text-xs italic text-center text-black"
          >
            No match for your search
          </p>
          <template v-else>
            <p
              v-for="option in filteredItems"
              :id="option.selectId"
              :key="option.selectId"
              role="button"
              class="
                flex
                items-center
                px-3
                py-3
                text-xs
                border border-transparent
                rounded-md
                hover:border-app-gray-150
                a-selectable-option
              "
              :class="[
                {
                  'font-bold text-red-500': selectedIndex === option.selectId,
                  'text-black': selectedIndex != option.selectId,
                },
              ]"
              @click.stop="updateInput(option.value, option.selectId)"
            >
              <span class="flex-grow">
                {{ option.value[labelKey] }}
              </span>
              <span class="">
                <MaterialIcon
                  v-if="selectedIndex === option.selectId"
                  icon="radio_button_checked"
                  class="text-xs text-red-500"
                />

                <MaterialIcon
                  v-else
                  icon="radio_button_unchecked"
                  class="text-xs opacity-0 text-app-gray-150 radio-icon"
                />
              </span>
            </p>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  name: 'SelectMenu',

  mixins: [clickaway],

  props: {
    //   functions
    labelGetterFunction: {
      type: Function,
      default: null,
    },

    valueGetterFunction: {
      type: Function,
      default: null,
    },

    //   Combined
    value: {
      type: [String, Boolean, Number],
      default: null,
    },

    valueKey: {
      type: String,
      default: null,
    },

    labelKey: {
      type: String,
      default: null,
    },

    //   arrays
    options: {
      type: Array,
      default: () => [],
    },

    //   strings
    parentRectId: {
      type: String,
      default: null,
    },

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

    error: {
      type: Boolean,
      default: false,
    },

    errorRequired: {
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

    clearValueOnDestroy: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      id: null,
      position: 'bottom',
      inputValue: null,
      inputLabel: null,
      dropdownVisible: false,
      selectedIndex: null,
      sort: false,
      refinedOptions: [],
      optionsKey: null,
    }
  },

  computed: {
    dropdownPosition() {
      return this.position === 'top' ? { bottom: '50px' } : { top: '50px' }
    },

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

    searchTerm() {
      return this.inputLabel
    },

    filteredItems() {
      if (this.searchTerm && this.sort) {
        return this.refinedOptions.filter((item) => {
          let str
          if (this.labelGetterFunction) {
            str = this.labelGetterFunction(item).toString()
          } else {
            str = item.value[this.labelKey].toString()
          }
          return str.toLowerCase().match(this.searchTerm.toLowerCase())
        })
      } else {
        return this.refinedOptions
      }
    },
  },

  watch: {
    dropdownVisible() {
      if (!this.dropdownVisible) {
        this.hideDropdown()
      }
    },

    options: {
      handler(val) {
        if (val.length) {
          this.initializeOptions()
        }
      },

      deep: true,
    },
  },

  mounted() {
    this.id = this.$uuid()
    this.initializeOptions()
  },

  beforeDestroy() {
    this.clearSelection()
  },

  methods: {
    positionMenu() {
      const wHeight = window.innerHeight
      let parent
      let topArea
      let bottomArea

      const i = this

      const checkArea = function () {
        if (topArea > bottomArea) {
          i.position = 'top'
        } else {
          i.position = 'bottom'
        }
      }

      if (!this.id) return

      const ref = this.$refs[this.id].getBoundingClientRect()

      if (!ref) return

      if (!this.parentRectId) {
        topArea = Math.abs(ref.top)
        bottomArea = Math.abs(wHeight - ref.bottom)

        checkArea()
      } else {
        parent = this.$parent.$refs[this.parentRectId].getBoundingClientRect()

        topArea = Math.abs(ref.top - parent.top)
        bottomArea = Math.abs(ref.bottom - parent.bottom)

        checkArea()
      }
    },

    initializeOptions() {
      this.optionsKey = this.$uuid()
      if (this.options.length) {
        this.refinedOptions = this.options.map((option) => {
          return {
            selectId: this.$uuid(),
            value: this.valueGetterFunction
              ? this.valueGetterFunction(option)
              : option,
          }
        })

        // bind if there is an existing value
        setTimeout(() => {
          this.positionMenu()

          if (this.value === null) return
          if (this.value.toString()) {
            const foundIndex = this.refinedOptions.findIndex((option) => {
              return (
                option.value[this.valueKey].toString() === this.value.toString()
              )
            })

            if (foundIndex >= 0) {
              this.inputLabel =
                this.refinedOptions[foundIndex].value[this.labelKey]
              this.inputValue =
                this.refinedOptions[foundIndex].value[this.valueKey]
              this.selectedIndex = this.refinedOptions[foundIndex].selectId
              this.emitInput(this.inputValue)
            } else {
              this.clearSelection()
            }
          }
        }, 70)

        // pass clear selection function to parent
        this.$emit('clear-selection', this.clearSelection)
      } else {
        this.clearSelection()
      }
    },

    updateInput(value, index) {
      this.inputValue = value[this.valueKey]
      this.inputLabel = value[this.labelKey]
      this.selectedIndex = index
      this.dropdownVisible = false
      this.sort = false
      this.emitInput(this.inputValue)
    },

    clearSelection() {
      this.inputValue = null
      this.inputLabel = null
      this.selectedIndex = null
      this.sort = false
      if (this.clearValueOnDestroy) this.emitInput(null)
    },

    showDropdown() {
      this.positionMenu()
      this.sort = false
      this.dropdownVisible = true
      if (this.selectedIndex) {
        setTimeout(() => {
          const target = document.getElementById(this.selectedIndex)
          if (target) target.parentNode.scrollTop = target.offsetTop
        }, 20)
      } else if (this.refinedOptions.length) {
        setTimeout(() => {
          const target = document.getElementById(
            this.refinedOptions[0].selectId
          )
          if (target) target.parentNode.scrollTop = target.offsetTop
        }, 20)
      }
    },

    hideDropdown() {
      if (this.dropdownVisible) {
        this.sort = false
        this.dropdownVisible = false
        if (this.selectedIndex && !this.searchTerm) {
          const i = this.refinedOptions.findIndex((item) => {
            return item.selectId === this.selectedIndex
          })
          if (i >= 0) {
            this.inputValue = this.refinedOptions[i].value[this.valueKey]
            this.inputLabel = this.refinedOptions[i].value[this.labelKey]
            this.emitInput(this.inputValue)
          }
        } else if (this.searchTerm) {
          let selectedIndex
          let option
          this.filteredItems.every((item) => {
            if (this.labelGetterFunction) {
              if (this.labelGetterFunction(item) === this.searchTerm) {
                option = item
                selectedIndex = item.selectId
                return false
              }
            } else if (item.value[this.labelKey] === this.searchTerm) {
              option = item
              selectedIndex = item.selectId
              return false
              //   break
            }
            return true
          })

          if (selectedIndex && option) {
            this.selectedIndex = selectedIndex
            this.inputValue = this.labelGetterFunction
              ? this.labelGetterFunction(option)
              : option.value[this.valueKey]
            this.inputLabel = this.labelGetterFunction
              ? this.labelGetterFunction(option)
              : option.value[this.labelKey]
            this.emitInput(this.inputValue)
          }
        } else {
          this.clearSelection()
        }

        this.emitBlur()
      }
    },

    emitInput(value) {
      this.$emit('input', value)
    },

    emitBlur(value) {
      this.$emit('blur')
    },
  },
}
</script>

<style lang="postcss" scoped>
.input-base-container {
  @apply tracking-tight leading-tight;
}

.input-base {
  /* remove webkit default style */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* input style */
  @apply relative w-full rounded-full transition-shadow ease-in-out flex;
  &:focus-within {
    @apply outline-none shadow-lg ring-2 ring-app-gray-250 ring-offset-1;
  }
}

.input-base input[type='text'] {
  @apply relative w-full rounded-none flex-grow border-none bg-transparent py-3 px-4;
  &:focus {
    @apply outline-none;
  }
}

/* select dropdown */
.select-dropdown {
  @apply absolute rounded-lg left-0 right-0 bg-white z-10 overflow-auto max-h-[200px] shadow-lg;
}

.a-selectable-option:hover .radio-icon {
  @apply opacity-100;
}

/* themes */

/* Input Themes */

/* Select Theme WFBGBB */
.white-fill-brand-gray-bottom-border {
  @apply text-black border border-app-gray-550 bg-white;
  &:focus {
    /* @apply border-app-gray-250; */
  }
}

/* Select Theme BGFWBB */
.brand-gray-fill-white-bottom-border {
  @apply text-white border border-opacity-25 border-b-white bg-app-gray-150;
  &:focus {
    @apply border-white;
  }
}
</style>
