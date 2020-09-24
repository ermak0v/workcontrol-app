import axios from 'axios'
import auth from '../store/modules/auth'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
axios.defaults.headers['Content-Type'] = 'application/vnd.api+json';

export default {
  getLogs(){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/logs/update-moderate')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  moderatePatchIncident(data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.patch('/incidents/' + data.attributes._id + 'moderate', data)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  deletePatchIncident(data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.patch('/incidents/' + data.attributes._id + 'delete', data)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  patchIncident(data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.patch('/incidents/' + data._id,{
        data: {
          id: data.id,
          type: "Incident",
          attributes: {
            description: data.description,
            proof: data.proof,
            FPositive: data.FPositive,
            FEpic: data.FEpic,
          },
          relationships: {
            target: {
              data: {
                type: "User",
                id: data.target
              }
            },
            criterion: {
              data: {
                type: "Criterion",
                id: data.criterion
              }
            }
          }
        }
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getIncidents() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/incidents/?include=target')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getSentIncidents() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/incidents/sent/?include=target')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  postIncident(data) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.post('/incidents',{
        data: {
          type: "Incident",
          attributes: {
            description: data.description,
            proof: data.proof,
            FPositive: data.FPositive,
            FEpic: data.FEpic,
          },
          relationships: {
            target: {
              data: {
                type: "User",
                id: data.target
              }
            },
            criterion: {
              data: {
                type: "Criterion",
                id: data.criterion
              }
            }
          }
        }
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getCriterion() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/criteria')
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getAllUsers() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/users')
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getWorkers() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/users/workers')
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}