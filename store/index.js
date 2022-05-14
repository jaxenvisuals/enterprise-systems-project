export const state = () => {
  return {
    dataSets: {
      flights: null,
      passengers: null,
      threats: null,
      aircrafts: null,
      airlines: null,
      airports: null,
    },
    activeFlight: null,
  }
}

export const getters = {
  dataSets(state) {
    return state.dataSets
  },

  computedThreats(state) {
    const computedThreats = JSON.parse(JSON.stringify(state.dataSets.threats))
    if (computedThreats) {
      const threatLevelHeaderIndex =
        computedThreats.tableData?.header.findIndex(
          (h) => h.label === 'Threat Level'
        )
      if (threatLevelHeaderIndex < 0) return null

      let fieldsToAdd = [
        'Terrorism (50%)',
        'Smuggling (20%)',
        'Narcotics (15%)',
        'Illegal Immigration (15%)',
      ]

      fieldsToAdd = fieldsToAdd.map((f) => {
        const fieldIndex = computedThreats.tableData.header.findIndex(
          (h) => h.label === f
        )
        if (fieldIndex < 0) return { label: f, index: null }
        return { label: f, index: fieldIndex }
      })

      const refined = computedThreats.tableData?.body?.map((row) => {
        const valuesToAdd = []
        fieldsToAdd.forEach((f, i) => {
          if (f.index) {
            const threatPoint = row.values[f.index]?.label
            if (i === 0 && threatPoint >= 40) {
              valuesToAdd.push(Number(65 || 0))
            }
            valuesToAdd.push(Number(threatPoint || 0))
          }
        })

        const sum = valuesToAdd.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        )

        const level = getThreatLevel(sum)
        row.values[threatLevelHeaderIndex].label = level
        row.options.rowClass =
          level === 'High' ? 'high' : level === 'Medium' ? 'medium' : 'low'
        return row
      })

      computedThreats.tableData.body = refined
      return computedThreats
    }
    return null
  },

  computedPassengers(state, getters) {
    const computedPassengers = JSON.parse(
      JSON.stringify(state.dataSets.passengers)
    )
    if (computedPassengers && getters.computedThreats?.tableData?.body) {
      const header = 'Passport Number'

      const passportNumberIndex =
        computedPassengers.tableData?.header.findIndex(
          (h) => h.label === header
        )

      const threatDataPassportNumberIndex =
        getters.computedThreats.tableData?.header.findIndex(
          (h) => h.label === header
        )

      if (!(passportNumberIndex >= 0 && threatDataPassportNumberIndex >= 0))
        return null

      const threatLevelHeaderIndex =
        computedPassengers.tableData?.header.findIndex(
          (h) => h.label === 'Threat Level'
        )

      const threatLevelHeaderIndexInThreatRecord =
        getters.computedThreats.tableData?.header.findIndex(
          (h) => h.label === 'Threat Level'
        )

      if (
        !(
          threatLevelHeaderIndex >= 0 &&
          threatLevelHeaderIndexInThreatRecord >= 0
        )
      )
        return null

      const refined = computedPassengers.tableData?.body?.map((r) => {
        const personThreat = getters.computedThreats.tableData.body.findIndex(
          (row) => {
            return (
              row.values[threatDataPassportNumberIndex].label ===
              r.values[passportNumberIndex].label
            )
          }
        )

        if (personThreat < 0) return r

        r.values[threatLevelHeaderIndex].label =
          getters.computedThreats.tableData.body[personThreat].values[
            threatLevelHeaderIndexInThreatRecord
          ].label || ''

        return r
      })

      computedPassengers.tableData.body = refined
      return computedPassengers
    }
    if (computedPassengers) {
      return computedPassengers
    }
    return null
  },

  getRow(state) {
    return (args) => {
      return findRow(state, args)
    }
  },

  filterRow(state) {
    return (args) => {
      return filterRow(state, args)
    }
  },

  evaluatedFlights(state, getters) {
    let table = getters.dataSets.flights.tableData
    if (!table?.body?.length) {
      return null
    }

    table = JSON.parse(JSON.stringify(table))

    const aircraftIdx = table.header.findIndex((h) => h.label === 'Aircraft')
    const deptIdx = table.header.findIndex((h) => h.label === 'Departure')
    const arrIdx = table.header.findIndex((h) => h.label === 'Arrival')
    const termIdx = table.header.findIndex((h) => h.label === 'Terminal')
    const flightIdx = table.header.findIndex((h) => h.label === 'Flight Number')

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
          details: getters.getRow({
            id: row.values[aircraftIdx].label,
            data: 'aircrafts',
            key: 'Aircraft Number',
          }),
        },
        dept: {
          raw: row.values[deptIdx].label,
          details: getters.getRow({
            id: row.values[deptIdx].label,
            data: 'airports',
            key: 'IATA Code',
          }),
        },
        arr: {
          raw: row.values[arrIdx].label,
          details: getters.getRow({
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
          details: getters.filterRow({
            id: row.values[flightIdx].label,
            data: 'passengers',
            key: 'Flight Number',
          }),
          airline: getters.getRow({
            id: row.values[flightIdx].label[0] + row.values[flightIdx].label[1],
            data: 'airlines',
            key: '2 Letter Code',
          }),
        },
      }

      evaluatedData.push(newData)
    })

    return evaluatedData
  },
}

export const mutations = {
  setDataSets(state, { key, value }) {
    state.dataSets[key] = value
    localStorage.setItem('state', JSON.stringify(state.dataSets))
  },

  setState(state, payload) {
    state.dataSets = payload
  },

  setActiveFlightView(state, payload) {
    state.activeFlight = payload
  },
}

export const actions = {}

function getThreatLevel(sum) {
  let level = ''
  switch (true) {
    case sum >= 65: {
      level = 'High'
      break
    }
    case sum >= 32: {
      level = 'Medium'
      break
    }
    case sum >= 1: {
      level = 'Low'
      break
    }
    default:
      level = ''
  }

  return level
}

function getHeaderIndex(table, label) {
  const index = table.header.findIndex((h) => h.label === label)

  return index < 0 ? false : index
}

function getRow(table, valueIndex, id) {
  const idx = table.body.findIndex((r) => r.values[valueIndex].label === id)

  return idx < 0 ? false : table.body[idx]
}

function getFilteredRow(table, valueIndex, id) {
  const filtered = table.body.filter((r) => r.values[valueIndex].label === id)

  return filtered.length < 1 ? false : filtered
}

function findRow(state, { id, data, key }) {
  if (!state.dataSets[data]?.tableData?.body?.length) return null

  const table = JSON.parse(JSON.stringify(state.dataSets[data].tableData))
  const valueIndex = getHeaderIndex(table, key)
  if (valueIndex < 0) return false

  const row = getRow(table, valueIndex, id)

  return row.values
}

function filterRow(state, { id, data, key }) {
  if (!state.dataSets[data]?.tableData?.body?.length) return null

  const table = JSON.parse(JSON.stringify(state.dataSets[data].tableData))
  const valueIndex = getHeaderIndex(table, key)
  if (valueIndex < 0) return false

  const filtered = getFilteredRow(table, valueIndex, id)

  if (!filtered) return false

  return filtered
}

function greaterThanZero(n) {
  return n >= 0
}
