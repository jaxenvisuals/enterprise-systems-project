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
