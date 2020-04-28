import axios from 'axios';
var config = require('../../config');

export default {
  uploadImage({ userId, authToken, data }) {
    let url = process.env.BACKEND_URL + '/api/v1/photos';

    return new Promise((resolve, reject) => {
      axios.post(url, data, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(response => {
          resolve(response.data.data);
        }, error => {
          if(!error.request.response) reject('');
          console.log(error.request.response);
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  }
}
