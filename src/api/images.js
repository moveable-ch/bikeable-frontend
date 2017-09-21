import axios from 'axios';

export default {
  uploadImage({ userId, authToken, data }) {
    let url = 'https://backend.bikeable.ch/api/v1/photos';

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
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  }
}
