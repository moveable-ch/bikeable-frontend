import axios from 'axios';
var config = require('../../config');

export default {
  getUserData({ userId, authToken }) {
    let url = process.env.BACKEND_URL + '/api/v1/users/current';

    return new Promise((resolve, reject) => {
      axios.get(url, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(response => {
          resolve(response.data.data);
        }, response => {
          reject(response.data.message);
        });
    });
  },

  updateUser({ userId, authToken }, data) {
    let url = process.env.BACKEND_URL + '/api/v1/users';

    return new Promise((resolve, reject) => {
      axios.put(url, data,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
      .then(
        (response) => {
          resolve(response.data.data);
        }
      )
      .catch(
        (error) => {
          if(!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  }
}
