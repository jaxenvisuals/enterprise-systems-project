<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Passengers</p>

    <div v-if="computedPassengers" class="mt-4 grid grid-cols-12">
      <div
        class="bg-white border shadow-md overflow-auto"
        :class="[!analysis.visible ? 'col-span-12' : 'col-span-6']"
      >
        <CustomTable
          :table-data="computedPassengers.tableData"
          :options="options"
        />
      </div>
      <div v-if="analysis.visible" class="col-span-6">
        <div ref="e-chart"></div>
        <div ref="e-guage"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

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

  methods: {
    handleClick(e) {
      // if (e.index === this.analysis.current.index) return
      // this.analysis.visible = true
      // this.analysis.current = e
      // setTimeout(() => {
      //   const instance = this.initEchart()
      //   if (instance) this.analysis.chartInstance = instance
      // }, 200)
    },

    initEchart() {
      let fields = [
        'Terrorism',
        'Narcotics',
        'Smuggling',
        'Illegal Immigration',
        'Revenue',
      ]
      const instanceHeader = this.analysis.current.instanceData.header
      const rowData = this.analysis.current.rowData.values
      fields = fields.map((f) => {
        const i = instanceHeader.findIndex((h) => {
          return f === h.label
        })
        if (i < 0) return { i: null, label: f }

        let value = rowData[i].label.trim()

        if (value[value.length - 1] === '%') {
          value = value.slice(0, value.length - 1)
        }
        return {
          name: f,
          value: Number(value),
        }
      })

      if (this.analysis.chartInstance) {
        this.analysis.chartInstance.setOption({
          series: [
            {
              data: fields,
            },
          ],
        })
        this.$store.commit(
          'analysis/setActiveSelection',
          this.analysis.current.index
        )
        return null
      }

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
            dataView: { show: false, readOnly: true },
            restore: { show: false },
            saveAsImage: { show: false },
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
            data: fields,
          },
        ],
      }

      if (option) {
        myChart.setOption(option)
        this.$store.commit(
          'analysis/setActiveSelection',
          this.analysis.current.index
        )
        return myChart
      }
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

      // setTimeout(() => {
      //   myChart.dispose()
      // }, 5000)
    },
  },
}
</script>
