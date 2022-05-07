<template>
  <thead class="px-2 text-black border-b border-gray-600">
    <tr>
      <th
        v-if="numbered"
        class="
          px-2
          py-1
          text-sm
          font-bold
          leading-snug
          text-left
          hover:opacity-70
          select-none
        "
        :class="[{ 'cursor-pointer': sortable }]"
        @click="emitSortKey(null)"
      >
        S/N
        <MaterialIcon
          v-if="sortable"
          icon="sort_by_alpha"
          class="text-xs"
          :class="[
            { 'text-red-500': !(sortKey !== null && sortKey !== undefined) },
          ]"
        />
      </th>
      <th
        v-for="(header, i) in data"
        :key="i"
        class="
          px-2
          py-1
          text-sm
          font-bold
          leading-snug
          text-left
          hover:opacity-70
          select-none
        "
        :class="[{ 'cursor-pointer': sortable }]"
        @click="emitSortKey(i)"
      >
        {{ header.label || '--' }}
        <MaterialIcon
          v-if="sortable"
          icon="sort_by_alpha"
          class="text-xs"
          :class="[{ 'text-red-500': sortKey === i }]"
        />
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

    numbered: {
      type: Boolean,
      default: false,
    },

    sortable: {
      type: Boolean,
      default: false,
    },

    sortKey: {
      type: Number,
      default: null,
    },
  },

  methods: {
    emitSortKey(k) {
      if (this.sortable) {
        this.$emit('sort', k)
      }
    },
  },
}
</script>
