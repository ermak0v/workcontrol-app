import api from "../../api/api";

export  default {
  state: {
    users: null
  },
  getters: {
    users(state, getters, rootState, rootGetters) {
      if (state.users !== null){
        return state.users.filter(function(item) {
          return item.id !== '/api/users/' + rootGetters.idCurrentUser;
        });
      }
    }
  },
  mutations: {
    retrieveUsers(state, data) {
      state.users = data
    },
  },
  actions: {
    retrieveUsers({ commit }) {
      return new Promise((resolve, reject) => {
        api.getUsers()
          .then(response => {
            resolve(response)
            commit('retrieveUsers', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}