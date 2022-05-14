<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Incoming Flights</p>

    <div v-if="stateDataSet" class="mt-4">
      <CustomTable
        :table-data="stateDataSet.tableData"
        :options="options"
        sortable
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightsPage',

  computed: {
    options() {
      return {
        serial: true,
        clickable: true,
        events: {
          handleRowClick: this.handleClick,
        },
      }
    },

    stateDataSet() {
      return this.$store.getters.dataSets[this.$route.name] || null
    },

    evaluatedFlights() {
      return this.$store.getters.evaluatedFlights
    },
  },

  methods: {
    handleClick(e) {
      this.$store.commit('setActiveFlightView', {
        selected: this.evaluatedFlights[e.index],
        ...e,
      })

      this.$router.push('/view-flight')
    },
  },
}
</script>
