import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

export default {
  retrieveToken(data){
    return new Promise((resolve, reject) => {
      axios.post('/login_check', {
        email: data.email,
        password: data.password,
      },{
        headers:{
          "Content-Type": 'application/json'
        }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        })
    })
  }
}