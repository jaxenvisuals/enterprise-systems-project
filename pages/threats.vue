<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Threats</p>

    <div v-if="computedThreats" class="">
      <CollapsibleChart />

      <CustomTable
        :table-data="computedThreats.tableData"
        :options="{ serial: true }"
        sortable
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThreatsPage',

  data() {
    return {}
  },

  computed: {
    computedThreats() {
      return this.$store.getters.computedThreats || null
    },
  },

  mounted() {},

  methods: {},
}
</script>
