<template>
  <span :class="materialFamily">{{ icon || 'help_outline' }}</span>
</template>

<script>
export default {
  name: 'Material',

  props: {
    family: {
      type: String,
      default: 'outlined',
    },

    icon: {
      type: String,
      default: null,
    },
  },

  computed: {
    materialFamily() {
      const family = !this.family ? '' : `-${this.family}`
      return `material-icons` + family
    },
  },
}
</script>
