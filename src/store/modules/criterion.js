import api from "../../api/api";

export  default {
  state: {
    criteria: null
  },
  getters: {
    criteria(state) {
      return state.criteria
    }
  },
  mutations: {
    retrieveCriteria(state, data) {
      state.criteria = data
    },
  },
  actions: {
    retrieveCriteria({ commit }) {
      return new Promise((resolve, reject) => {
        api.getCriterion()
          .then(response => {
            resolve(response)
            commit('retrieveCriteria', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}