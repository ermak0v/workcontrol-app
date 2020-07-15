import axios from 'axios'
import auth from '../store/modules/auth'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
axios.defaults.headers['Content-Type'] = 'application/vnd.api+json';
if (auth.state.token !== null){
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.state.token;
}

export default {
  postIncident(data) {
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