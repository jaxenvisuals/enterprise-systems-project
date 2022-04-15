<template>
  <tr class="px-2 pt-2 table-body">
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
