import api from "../../api/api";

export  default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    addIncident(context, data) {
      return new Promise((resolve, reject) => {
        api.postIncident(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}