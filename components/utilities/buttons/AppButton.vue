<template>
  <button
    v-if="button"
    :disabled="disabled"
    class="
      rounded-full
      px-5
      py-3
      border border-[#c4c4c4]
      text-black text-sm
      font-bold
      leading-snug
    "
    :class="[{ 'text-black bg-white': !dark, 'text-white bg-black': dark }]"
    @click.prevent="onClick"
  >
    {{ title }}
  </button>
  <nuxt-link
    v-else
    :to="url"
    class="
      text-center
      inline-block
      rounded-full
      px-5
      py-3
      border border-[#c4c4c4]
      text-black text-sm
      font-bold
      leading-snug
    "
    :class="[{ 'text-black bg-white': !dark, 'text-white bg-black': dark }]"
  >
    {{ title }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'AppButton',

  props: {
    title: {
      type: String,
      default: 'Enter Title',
    },

    url: {
      type: String,
      default: '#',
    },

    dark: {
      type: Boolean,
      default: false,
    },

    button: {
      type: Boolean,
      default: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>
