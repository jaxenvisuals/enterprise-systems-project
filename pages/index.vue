<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Dashboard</p>

    <div class="mt-4">
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-6 p-10 bg-white shadow">
          <GChart
            type="ColumnChart"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
  name: 'Dashboard',

  components: {
    GChart,
  },

  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        },
      },
    }
  },

  computed: {},

  mounted() {},

  methods: {},
}
</script>
