import api from "../../api/api";

export  default {
  state: {
    users: null,
    workers: null
  },
  getters: {
    workers(state, getters, rootState, rootGetters) {
      if (state.workers !== null){
        return state.workers.filter(function(item) {
          return item.id !== '/api/users/' + rootGetters.idCurrentUser;
        });
      }
    },
    allUsers(state) {
      if (state.users !== null){
        return state.users
      }
    }
  },
  mutations: {
    retrieveWorkers(state, data) {
      state.workers = data
    },
    retrieveAllUsers(state, data) {
      state.users = data
    },
  },
  actions: {
    retrieveAllUsers({ commit }) {
      return new Promise((resolve, reject) => {
        api.getAllUsers()
          .then(response => {
            resolve(response)
            commit('retrieveAllUsers', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    retrieveWorkers({ commit }) {
      return new Promise((resolve, reject) => {
        api.getWorkers()
          .then(response => {
            resolve(response)
            commit('retrieveWorkers', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}