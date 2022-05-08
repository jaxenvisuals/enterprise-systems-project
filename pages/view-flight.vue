<template>
  <div v-if="flight" class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Flight {{ flight.flightNum.raw }}</p>

    <div class="mt-3">
      <div class="grid grid-cols-4 shadow border divide-x">
        <div class="px-4 py-2">
          <p class="font-bold text-sm">Flight {{ flight.flightNum.raw }}</p>
          <div class="text-xs mt-1">
            <p v-for="(a, i) in refinedData.airline" :key="i" class="mt-px">
              {{ a.label }}: {{ flight.flightNum.airline[a.index].label }}
            </p>
          </div>
        </div>
        <div class="px-4 py-2">
          <p class="font-bold text-sm">Aircraft {{ flight.aircraft.raw }}</p>
          <div class="text-xs mt-1">
            <p v-for="(a, i) in refinedData.aircrafts" :key="i" class="mt-px">
              {{ a.label }}: {{ flight.aircraft.details[a.index].label }}
            </p>
            <p class="mt-px">Crew: 14</p>
            <p class="mt-px">
              Passengers: {{ flight.flightNum.details.length }}
            </p>
          </div>
        </div>

        <div class="px-4 py-2">
          <p class="font-bold text-sm">Departure</p>
          <div class="text-xs mt-1">
            <p v-for="(a, i) in refinedData.departure" :key="i" class="mt-px">
              {{ a.label }}: {{ flight.dept.details[a.index].label }}
            </p>
          </div>
        </div>

        <div class="py-2">
          <p class="px-4 font-bold text-sm">Arrival</p>
          <div class="text-xs mt-1">
            <div class="px-4">
              <p v-for="(a, i) in refinedData.arrival" :key="i" class="mt-px">
                {{ a.label }}: {{ flight.arr.details[a.index].label }}
              </p>
            </div>
            <p class="mt-2 border-t pt-2 px-4">
              Terminal: {{ flight.term.raw }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allPassengers" class="mt-4">
      <CustomTable :table-data="allPassengers.tableData" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewFlight',

  data() {
    return {
      keys: {
        aircraft: ['Passenger Capacity', 'Crew Capacity'],
        departure: ['ISO Alpha 3 Code', 'Long Name', 'Long Location'],
        arrival: ['ISO Alpha 3 Code', 'Long Name', 'Long Location'],
        airline: ['2 Letter Code', 'Company Name', 'Country'],
      },
    }
  },

  computed: {
    flight() {
      return this.$store.state.activeFlight?.selected
    },

    allPassengers() {
      let passengers = this.$store.state.dataSets.passengers
      if (!(passengers && this.flight)) return null

      passengers = JSON.parse(JSON.stringify(passengers))
      passengers.tableData.body = this.flight.flightNum.details

      return passengers
    },

    refinedData() {
      return {
        aircrafts: this.keys.aircraft.map((a) => {
          return {
            label: a,
            index: getHeaderIndex(
              this.$store.state.dataSets.aircrafts.tableData,
              a
            ),
          }
        }),
        departure: this.keys.departure.map((a) => {
          return {
            label: a,
            index: getHeaderIndex(
              this.$store.state.dataSets.airports.tableData,
              a
            ),
          }
        }),
        arrival: this.keys.arrival.map((a) => {
          return {
            label: a,
            index: getHeaderIndex(
              this.$store.state.dataSets.airports.tableData,
              a
            ),
          }
        }),
        airline: this.keys.airline.map((a) => {
          return {
            label: a,
            index: getHeaderIndex(
              this.$store.state.dataSets.airlines.tableData,
              a
            ),
          }
        }),
      }
    },
  },
}

function getHeaderIndex(table, label) {
  const index = table.header.findIndex((h) => h.label === label)

  return index < 0 ? false : index
}
</script>
