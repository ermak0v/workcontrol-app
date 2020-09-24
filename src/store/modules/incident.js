import api from "../../api/api";

export  default {
  state: {
    sentIncidents: null,
    allIncidents: null
  },
  getters: {
    targetsIncidentsSent(state) {
      if (state.sentIncidents !== null){
        return state.sentIncidents.included
      }
    },
    sentIncidents(state) {
      if (state.sentIncidents !== null){
        return state.sentIncidents.data.filter(incident => incident.attributes.FDelete === false)
      }
    },
    allIncidents(state) {
      if (state.allIncidents !== null){
        return state.allIncidents.data
      }
    },
  },
  mutations: {
    retrieveSentIncidents(state, data) {
      state.sentIncidents = data
    },
    retrieveIncidents(state, data) {
      state.allIncidents = data
    },
    deleteIncident(state, data) {
      state.sentIncidents.data = state.sentIncidents.data.filter(item => item.id !== data.id)
    },
    moderateIncident(state, data) {
      state.sentIncidents.data.forEach(function(entry) {
        if (entry.id === data.id) {
          entry.attributes.FModer = true
        }
      });
      state.allIncidents.data.forEach(function(entry) {
        if (entry.id === data.id) {
          entry.attributes.FModer = true
        }
      });
    },
    updateIncident(state, data) {
      state.sentIncidents.data.forEach(function(entry) {
        if (entry.id === data.id) {
          entry.attributes.description = data.description
          entry.attributes.proof = data.proof
          entry.attributes.FPositive = data.FPositive
          entry.attributes.FEpic = data.FEpic
          entry.relationships.target.data.id = data.target
          entry.relationships.criterion.data.id = data.criterion
        }
      });
    }
  },
  actions: {
    moderateIncident({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.moderatePatchIncident(data)
          .then(response => {
            resolve(response)
            commit('moderateIncident', data);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteIncident({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.deletePatchIncident(data)
          .then(response => {
            resolve(response)
            commit('deleteIncident', data);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateIncident({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.patchIncident(data)
          .then(response => {
            resolve(response)
            commit('updateIncident', data);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
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
    },
    retrieveIncidents({ commit }) {
      return new Promise((resolve, reject) => {
        api.getIncidents()
          .then(response => {
            resolve(response)
            commit('retrieveIncidents', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    retrieveSentIncidents({ commit }) {
      return new Promise((resolve, reject) => {
        api.getSentIncidents()
          .then(response => {
            resolve(response)
            commit('retrieveSentIncidents', response);
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}