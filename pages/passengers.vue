<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Passengers</p>

    <div v-if="computedPassengers" class="grid grid-cols-12 mt-4">
      <div
        class="overflow-auto bg-white border shadow-md"
        :class="[!analysis.visible ? 'col-span-12' : 'col-span-6']"
      >
        <CustomTable
          :table-data="computedPassengers.tableData"
          :options="options"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassengersPage',

  data() {
    return {
      analysis: {
        visible: false,
        chartInstance: null,
        current: {},
      },
    }
  },

  computed: {
    stateDataSet() {
      return this.$store.getters.dataSets[this.$route.name] || null
    },

    computedThreats() {
      return this.$store.getters.computedThreats || null
    },

    options() {
      return {
        serial: true,
        clickable: true,
        events: {
          handleRowClick: this.handleClick,
        },
      }
    },

    computedPassengers() {
      return this.$store.getters.computedPassengers
    },
  },
}
</script>
