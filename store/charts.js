import * as echarts from 'echarts'

export function initThreatCategory(here) {
  const data = here.computedThreats.tableData
  const threatNames = [
    'Terrorism (50%)',
    'Smuggling (20%)',
    'Narcotics (15%)',
    'Illegal Immigration (15%)',
  ]

  const terrorismIndex = data.header.findIndex(
    (th) => th.label === threatNames[0]
  )
  const smugglingIndex = data.header.findIndex(
    (th) => th.label === threatNames[1]
  )
  const narcoticsIndex = data.header.findIndex(
    (th) => th.label === threatNames[2]
  )
  const illegalImmigrationIndex = data.header.findIndex(
    (th) => th.label === threatNames[3]
  )

  if (
    !(
      terrorismIndex >= 0 &&
      smugglingIndex >= 0 &&
      narcoticsIndex >= 0 &&
      illegalImmigrationIndex >= 0
    )
  )
    return

  const rowCount = data.body.length

  let terrorismSum = []
  let smugglingSum = []
  let narcoticsSum = []
  let illegalImmigrationSum = []

  data.body.forEach((row) => {
    terrorismSum.push(Number(row.values[terrorismIndex].label))
    smugglingSum.push(Number(row.values[smugglingIndex].label))
    narcoticsSum.push(Number(row.values[narcoticsIndex].label))
    illegalImmigrationSum.push(
      Number(row.values[illegalImmigrationIndex].label)
    )
  })

  const reducer = (prev, current) => prev + current

  terrorismSum = Number.parseFloat(
    (((terrorismSum.reduce(reducer, 0) / (50 * rowCount)) * 50) / 50) * 100
  ).toFixed(1)

  smugglingSum = Number.parseFloat(
    (((smugglingSum.reduce(reducer, 0) / (20 * rowCount)) * 20) / 20) * 100
  ).toFixed(1)

  narcoticsSum = Number.parseFloat(
    (((narcoticsSum.reduce(reducer, 0) / (15 * rowCount)) * 15) / 15) * 100
  ).toFixed(1)

  illegalImmigrationSum = Number.parseFloat(
    (((illegalImmigrationSum.reduce(reducer, 0) / (15 * rowCount)) * 15) / 15) *
      100
  ).toFixed(1)

  const threatCategoryData = [
    {
      name: threatNames[0] + ' ' + terrorismSum + '%',
      value: terrorismSum,
    },
    {
      name: threatNames[1] + ' ' + smugglingSum + '%',
      value: smugglingSum,
    },
    {
      name: threatNames[2] + ' ' + narcoticsSum + '%',
      value: narcoticsSum,
    },
    {
      name: threatNames[3] + ' ' + illegalImmigrationSum + '%',
      value: illegalImmigrationSum,
    },
  ]

  const threatCategory = (i) =>
    echarts.init(here.$refs['e-pie-threat-category-' + i], null, {
      width: 150,
      height: 190,
    })

  const option = {
    series: [
      {
        type: 'gauge',
        radius: '80%',
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.1, '#67e0e3'],
              [0.4, '#37a2da'],
              [1, '#fd666c'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
          width: 3,
        },
        axisTick: {
          distance: -3,
          length: 4,
          lineStyle: {
            color: '#fff',
            width: 1,
          },
        },
        splitLine: {
          distance: -6,
          length: 10,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        axisLabel: {
          color: 'auto',
          distance: 9,
          fontSize: 7,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: 'auto',
          fontSize: 10,
        },
        data: [
          {
            value: 50,
          },
        ],
      },
    ],
  }

  const option1 = JSON.parse(JSON.stringify(option))
  option1.series[0].axisLine.lineStyle.color = [
    [0.1, '#67e0e3'],
    [0.45, '#37a2da'],
    [1, '#fd666c'],
  ]
  option1.series[0].data[0].value = threatCategoryData[0].value
  option1 && threatCategory('1').setOption(option1)

  const option2 = JSON.parse(JSON.stringify(option))
  option2.series[0].axisLine.lineStyle.color = [
    [0.25, '#67e0e3'],
    [0.65, '#37a2da'],
    [1, '#fd666c'],
  ]
  option2.series[0].data[0].value = threatCategoryData[1].value
  option2 && threatCategory('2').setOption(option2)

  const option3 = JSON.parse(JSON.stringify(option))
  option3.series[0].axisLine.lineStyle.color = [
    [0.33, '#67e0e3'],
    [0.66, '#37a2da'],
    [1, '#fd666c'],
  ]
  option3.series[0].data[0].value = threatCategoryData[2].value
  option3 && threatCategory('3').setOption(option3)

  const option4 = JSON.parse(JSON.stringify(option))
  option4.series[0].axisLine.lineStyle.color = [
    [0.33, '#67e0e3'],
    [0.66, '#37a2da'],
    [1, '#fd666c'],
  ]
  option4.series[0].data[0].value = threatCategoryData[3].value
  option4 && threatCategory('4').setOption(option4)
}

export function initThreatLevel(here) {
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
  const data = here.computedThreats.tableData
  const threatIndex = data.header.findIndex((th) => th.label === 'Threat Level')

  if (threatIndex < 0) return

  data.body.forEach((th) => {
    if (th.values[threatIndex].label === 'High') {
      chartData[0].value = ++chartData[0].value
    } else if (th.values[threatIndex].label === 'Medium') {
      chartData[1].value = ++chartData[1].value
    } else if (th.values[threatIndex].label === 'Low') {
      chartData[2].value = ++chartData[2].value
    }
  })

  const myChart = echarts.init(here.$refs['e-pie-threat-level'], null, {
    width: 450,
    height: 200,
  })

  const option = {
    color: ['#fd666c', '#37a2da', '#67e0e3'],
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
        radius: '30%',
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
}
