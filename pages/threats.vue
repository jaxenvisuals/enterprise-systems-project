<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Threats</p>

    <div v-if="computedThreats" class="mt-4">
      <CustomTable :table-data="computedThreats.tableData" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThreatsPage',

  computed: {
    computedThreats() {
      return this.$store.getters.computedThreats || null
    },
  },

  methods: {},
}
</script>
