<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Incoming Flights</p>

    <div v-if="stateDataSet" class="mt-4">
      <CustomTable :table-data="stateDataSet.tableData" :options="options" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightsPage',

  computed: {
    options() {
      return {
        clickable: true,
        events: {
          handleRowClick: this.handleClick,
        },
      }
    },

    stateDataSet() {
      return this.$store.getters.dataSets[this.$route.name] || null
    },

    getRow() {
      return (a) => this.$store.getters.getRow(a)
    },

    filterRow() {
      return (a) => this.$store.getters.filterRow(a)
    },

    evaluatedFlights() {
      let table = this.stateDataSet?.tableData
      if (!table?.body?.length) {
        return null
      }

      table = JSON.parse(JSON.stringify(table))

      const aircraftIdx = table.header.findIndex((h) => h.label === 'Aircraft')
      const deptIdx = table.header.findIndex((h) => h.label === 'Departure')
      const arrIdx = table.header.findIndex((h) => h.label === 'Arrival')
      const termIdx = table.header.findIndex((h) => h.label === 'Terminal')
      const flightIdx = table.header.findIndex(
        (h) => h.label === 'Flight Number'
      )

      if (
        !(
          greaterThanZero(aircraftIdx) &&
          greaterThanZero(deptIdx) &&
          greaterThanZero(arrIdx) &&
          greaterThanZero(termIdx) &&
          greaterThanZero(flightIdx)
        )
      )
        return null

      const evaluatedData = []

      table.body.forEach((row) => {
        const newData = {
          aircraft: {
            raw: row.values[aircraftIdx].label,
            details: this.getRow({
              id: row.values[aircraftIdx].label,
              data: 'aircrafts',
              key: 'Aircraft Number',
            }),
          },
          dept: {
            raw: row.values[deptIdx].label,
            details: this.getRow({
              id: row.values[deptIdx].label,
              data: 'airports',
              key: 'IATA Code',
            }),
          },
          arr: {
            raw: row.values[arrIdx].label,
            details: this.getRow({
              id: row.values[arrIdx].label,
              data: 'airports',
              key: 'IATA Code',
            }),
          },
          term: {
            raw: row.values[termIdx].label,
          },
          flightNum: {
            raw: row.values[flightIdx].label,
            details: this.filterRow({
              id: row.values[flightIdx].label,
              data: 'passengers',
              key: 'Flight Number',
            }),
            airline: this.getRow({
              id:
                row.values[flightIdx].label[0] + row.values[flightIdx].label[1],
              data: 'airlines',
              key: '2 Letter Code',
            }),
          },
        }

        evaluatedData.push(newData)
      })

      return evaluatedData
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

function greaterThanZero(n) {
  return n >= 0
}
</script>
