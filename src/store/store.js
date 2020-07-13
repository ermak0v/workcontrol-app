import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  },
  getters: {
    loggedIn(state) {
      return state.token !== null
    },
    currentUserData(state){
      return state.currentUser
    },
  },
  mutations: {
    retrieveToken(state, data) {
      state.token = data.token
      state.currentUser = data.user
    },
    destroyToken(state) {
      state.token = null
      state.currentUser = null
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
              return item.id !== '/api/users/' + context.state.currentUser.id;
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
        localStorage.removeItem('currentUser');
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
            const data = response.data;
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('currentUser',  JSON.stringify(response.data.user))
            context.commit('retrieveToken', data);
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