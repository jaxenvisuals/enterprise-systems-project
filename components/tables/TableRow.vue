<template>
  <tr
    class="px-2 pt-2 table-body relative"
    :class="[
      { 'cursor-pointer': options.clickable },
      { 'bg-app-gray-150': selected },
    ]"
    @click="handleClick"
  >
    <td v-if="numbered" class="px-2 py-1 text-sm leading-snug text-left">
      {{ index + 1 }}
    </td>
    <td
      v-for="(body, i) in data.values"
      :key="i"
      class="px-2 py-1 text-sm leading-snug text-left"
    >
      {{ body.label }}
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TableRow',

  props: {
    data: {
      type: Object,
      required: true,
    },

    numbered: {
      type: Boolean,
      default: false,
    },

    index: {
      type: Number,
      default: null,
    },

    options: {
      type: [Object, Boolean],
      default: false,
    },
  },

  computed: {
    selected() {
      return (
        this.$store?.state?.analysis?.activeSelection === this.index || false
      )
    },
  },

  methods: {
    handleClick() {
      this.$emit('click', { data: this.data })
    },
  },
}
</script>

<style lang="postcss" scoped>
.table-body {
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
  &:is(:last-child) {
    border-bottom: 1px solid #718096;
  }
}
</style>
