import api from "../../api/api";

export  default {
  state: {
    logs: null,
  },
  getters: {
    logs(state){
      if (state.logs !== null){
        return state.logs
      }
    }
  },
  mutations: {
    retrieveLogs(state, data){
      state.logs = data
    }
  },
  actions: {
    retrieveLogs({ commit }, id) {
      return new Promise((resolve, reject) => {
        api.getLogs()
          .then(response => {
            resolve(response)
            response = response.data.filter(log => log.relationships.incident.data.id === id)
            commit('retrieveLogs', response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}