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
          level === 'High'
            ? 'bg-red-400 bg-opacity-20'
            : level === 'Medium'
            ? 'bg-yellow-400 bg-opacity-20'
            : ''
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
}

export const mutations = {
  setDataSets(state, { key, value }) {
    state.dataSets[key] = value
    localStorage.setItem('state', JSON.stringify(state.dataSets))
  },

  setState(state, payload) {
    state.dataSets = payload
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
