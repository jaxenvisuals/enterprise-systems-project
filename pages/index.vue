<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Dashboard</p>

    <div class="mt-4">
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-6 p-10 bg-white shadow">
          <!-- <GChart
            type="ColumnChart"
            :data="chartData"
            :options="chartOptions"
          /> -->
          <div ref="e-guage"></div>
        </div>
        <div class="col-span-6 p-10 bg-white shadow">
          <div ref="e-chart"></div>
        </div>
        <div class="col-span-6 p-10 bg-white shadow">
          <div ref="e-line"></div>
        </div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
        <div class="col-span-6 p-10 bg-white shadow"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { GChart } from 'vue-google-charts'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',

  components: {
    // GChart,
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

  mounted() {
    this.initGuage()
    setTimeout(() => {
      this.initEchart()
    }, 2000)
    setTimeout(() => {
      this.initLine()
    }, 4000)
  },

  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs['e-chart'], null, {
        width: 600,
        height: 400,
      })

      // initialize the echarts instance
      // Draw the chart
      const option = {
        backgroundColor: 'rgba(255,255,255,1)',
        legend: {
          top: 'bottom',
        },
        aria: {
          enabled: true,
          decal: {
            show: true,
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [10, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' },
            ],
          },
        ],
      }

      option && myChart.setOption(option)
    },

    initGuage() {
      const myChart = echarts.init(this.$refs['e-guage'], null, {
        width: 600,
        height: 400,
      })
      let option = {}

      const gaugeData = [
        {
          value: 20,
          name: 'Good',
          title: {
            offsetCenter: ['-40%', '80%'],
          },
          detail: {
            offsetCenter: ['-40%', '95%'],
          },
        },
        {
          value: 40,
          name: 'Better',
          title: {
            offsetCenter: ['0%', '80%'],
          },
          detail: {
            offsetCenter: ['0%', '95%'],
          },
        },
        {
          value: 60,
          name: 'Perfect',
          title: {
            offsetCenter: ['40%', '80%'],
          },
          detail: {
            offsetCenter: ['40%', '95%'],
          },
        },
      ]
      option = {
        series: [
          {
            type: 'gauge',
            anchor: {
              show: true,
              showAbove: true,
              size: 18,
              itemStyle: {
                color: '#FAC858',
              },
            },
            pointer: {
              icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
              width: 8,
              length: '80%',
              offsetCenter: [0, '8%'],
            },
            progress: {
              show: true,
              overlap: true,
              roundCap: true,
            },
            axisLine: {
              roundCap: true,
            },
            data: gaugeData,
            title: {
              fontSize: 14,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 14,
              color: '#fff',
              backgroundColor: 'auto',
              borderRadius: 3,
              formatter: '{value}%',
            },
          },
        ],
      }
      setInterval(function () {
        gaugeData[0].value = +(Math.random() * 100).toFixed(2)
        gaugeData[1].value = +(Math.random() * 100).toFixed(2)
        gaugeData[2].value = +(Math.random() * 100).toFixed(2)
        myChart.setOption({
          series: [
            {
              data: gaugeData,
            },
          ],
        })
      }, 2000)

      option && myChart.setOption(option)
    },

    initLine() {
      const myChart = echarts.init(this.$refs['e-line'], null, {
        width: 600,
        height: 400,
      })
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      }

      option && myChart.setOption(option)
    },
  },
}
</script>
