import apiAuth from "../../api/auth";

export  default {
  state: {
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  },
  getters: {
    loggedIn(state) {
      return state.token !== null
    },
    nameCurrentUser(state){
      if (state.currentUser !== null){
        return state.currentUser.username
      } else {
        return null
      }
    },
    idCurrentUser(state){
      if (state.currentUser !== null){
        return state.currentUser.id
      } else {
        return null
      }
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
    destroyToken(context) {
      if (context.getters.loggedIn) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        context.commit('destroyToken');
      }
    },
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        apiAuth.retrieveToken({
          email: credentials.email,
          password: credentials.password,
        })
          .then(response => {
            localStorage.setItem('token', response.token)
            localStorage.setItem('currentUser',  JSON.stringify(response.user))
            context.commit('retrieveToken', response);
            resolve(response);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          })
      })
    }
  }
}