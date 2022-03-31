<template>
  <div class="relative bg-[#e7e7e7] rounded-full w-full h-full flex">
    <div
      class="
        px-5
        py-3
        flex
        items-center
        justify-center
        flex-grow-0
        text-[#626161]
      "
    >
      <MaterialIcon class="text-sm" icon="filter_alt" />
    </div>

    <input
      v-bind="$attrs"
      :value="value"
      type="text"
      class="
        py-3
        block
        h-full
        flex-grow
        text-sm
        focus:outline-none
        text-[#626161]
        bg-[#e7e7e7]
      "
      :placeholder="placeholder"
      @input="emitInput($event.target.value)"
      @blur="emitBlur"
      @keydown.enter.prevent="emitEnter($event.target.value)"
    />

    <div
      class="
        px-5
        py-3
        flex
        items-center
        justify-center
        flex-grow-0
        text-[#626161]
        cursor-pointer
      "
      role="button"
      @click.prevent="search"
    >
      <MaterialIcon class="text-sm" icon="search" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconicInput',

  inheritAttrs: false,

  props: {
    // combined
    value: {
      type: [String, Number, Array, Object],
      default: null,
    },

    placeholder: {
      type: String,
      default: null,
    },
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

    search() {
      this.emitEnter()
    },
  },
}
</script>
