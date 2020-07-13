import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    idCurrentUser: localStorage.getItem('idCurrentUser') || null,
    nameCurrentUser: localStorage.getItem('nameCurrentUser') || null,
    emailCurrentUser: localStorage.getItem('emailCurrentUser') || null,
  },
  getters: {
    loggedIn(state) {
      return state.token !== null
    },
  },
  mutations: {
    retrieveToken(state, token, idCurrentUser, nameCurrentUser, emailCurrentUser) {
      state.token = token
      state.idCurrentUser = idCurrentUser
      state.nameCurrentUser = nameCurrentUser
      state.emailCurrentUser = emailCurrentUser
    },
    destroyToken(state) {
      state.token = null
      state.idCurrentUser = null
      state.nameCurrentUser = null
      state.emailCurrentUser = null
    },
  },
  actions: {
    addIncident(context, data) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      return new Promise((resolve, reject) => {
        axios.post('/incidents',{
          description: data.description,
          target: data.target,
          proof: data.proof,
          FPositive: data.FPositive,
          criterion: data.criterion,
          updateAt: data.updateAt
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    retrieveCriteria(context) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      return new Promise((resolve, reject) => {
        axios.get('/criteria.jsonapi')
          .then(response => {
            resolve(response.data.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    retrieveUsers(context) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      return new Promise((resolve, reject) => {
        axios.get('/users.jsonapi')
          .then(response => {
            let users = response.data.data.filter(function(item) {
              return item.id !== '/api/users/' + context.state.idCurrentUser;
            });
            resolve(users)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    destroyToken(context) {
      if (context.getters.loggedIn) {
        localStorage.removeItem('token');
        localStorage.removeItem('idCurrentUser');
        localStorage.removeItem('nameCurrentUser');
        localStorage.removeItem('emailCurrentUser');
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
            const idCurrentUser = response.data.user.id;
            const nameCurrentUser = response.data.user.username;
            const emailCurrentUser = response.data.user.email;
            localStorage.setItem('token', token);
            localStorage.setItem('idCurrentUser', idCurrentUser);
            localStorage.setItem('nameCurrentUser', nameCurrentUser);
            localStorage.setItem('emailCurrentUser', emailCurrentUser);
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