<template>
  <thead class="px-2 text-black border-b border-gray-600">
    <tr>
      <th
        v-for="(header, i) in data"
        :key="i"
        class="px-2 py-1 text-sm font-bold leading-snug text-left"
      >
        {{ header.label || '--' }}
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  name: 'TableHeader',

  props: {
    data: {
      type: Array,
      required: true,
    },
  },
}
</script>
