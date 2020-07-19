import axios from 'axios'
import auth from '../store/modules/auth'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
axios.defaults.headers['Content-Type'] = 'application/vnd.api+json';

export default {
  deletePatchIncident(data){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.patch('/incidents/' + data.attributes._id + 'delete',{
        data: {
          id: data.id,
          type: data.type,
          attributes: {
            description: data.attributes.description,
            proof: data.attributes.proof,
            FPositive: data.attributes.FPositive,
          },
          relationships: {
            target: {
              data: {
                type: "User",
                id: data.relationships.target.data.id
              }
            },
            criterion: {
              data: {
                type: "Criterion",
                id: data.relationships.criterion.data.id
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
  getSentIncidents() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
    return new Promise((resolve, reject) => {
      axios.get('/incidents/?filters[author]=' + auth.state.currentUser.id + '&include=target')
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
  getUsers() {
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
  }
}