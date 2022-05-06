<template>
  <div class="px-4 py-6 text-black">
    <p class="text-lg font-bold">Threats</p>

    <div v-if="computedThreats" class="">
      <div class="mx-auto mb-4">
        <div ref="e-pie" class="flex justify-center"></div>
      </div>
      <CustomTable :table-data="computedThreats.tableData" sortable />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ThreatsPage',

  computed: {
    computedThreats() {
      return this.$store.getters.computedThreats || null
    },
  },

  mounted() {
    setTimeout(() => {
      if (this.computedThreats) {
        this.initPie()
      }
    }, 200)
  },

  methods: {
    initPie() {
      const chartData = [
        {
          value: 0,
          name: 'High',
        },
        {
          value: 0,
          name: 'Medium',
        },
        {
          value: 0,
          name: 'Low',
        },
      ]
      const data = this.computedThreats.tableData
      const threatIndex = data.header.findIndex(
        (th) => th.label === 'Threat Level'
      )

      if (threatIndex < 0) return

      data.body.forEach((th) => {
        console.log(th.values[threatIndex])
        if (th.values[threatIndex].label === 'High') {
          chartData[0].value = ++chartData[0].value
        } else if (th.values[threatIndex].label === 'Medium') {
          chartData[1].value = ++chartData[1].value
        } else if (th.values[threatIndex].label === 'Low') {
          chartData[2].value = ++chartData[2].value
        }
      })

      const myChart = echarts.init(this.$refs['e-pie'], null, {
        width: 600,
        height: 400,
      })

      const option = {
        color: ['red', 'gold', 'gray'],
        legend: {
          top: 'bottom',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: false, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: false },
          },
        },
        series: [
          {
            name: 'Threat Data',
            type: 'pie',
            radius: '50%',
            data: chartData.map((c) => {
              return {
                name: c.name + ': ' + c.value,
                value: c.value,
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }

      option && myChart.setOption(option)
    },
  },
}
</script>
