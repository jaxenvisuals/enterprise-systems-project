<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Aircrafts</p>

    <div v-if="stateDataSet" class="mt-4">
      <CustomTable
        :table-data="stateDataSet.tableData"
        :options="{ serial: true }"
        sortable
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AircraftsPage',

  computed: {
    stateDataSet() {
      return this.$store.getters.dataSets[this.$route.name] || null
    },
  },
}
</script>
