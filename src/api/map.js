import axios from 'axios';
var config = require('../../config');

export default {
  getSponsoredEntries() {
    let url = process.env.BACKEND_URL + '/api/v1/sponsoredEntries';

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data.data);
        }, error => {
          if(!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  }
}
