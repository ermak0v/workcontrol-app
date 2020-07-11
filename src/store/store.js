import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
  },
  getters: {
    loggedIn(state) {
      return state.token !== null
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token
    },
    destroyToken(state) {
      state.token = null
    },
  },
  actions: {
    destroyToken(context) {
      if (context.getters.loggedIn) {
        localStorage.removeItem('token');
        context.commit('destroyToken');
      }
    },
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        axios.post('/login_check', {
          email: credentials.email,
          password: credentials.password,
        })
          .then(response => {
            const token = response.data.token;
            localStorage.setItem('token', token);
            context.commit('retrieveToken', token);
            resolve(response);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          })
      })
    },
  }
})