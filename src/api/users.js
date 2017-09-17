import axios from 'axios';

export default {
  getUserData({ userId, authToken }) {
    let url = 'https://backend.bikeable.ch/api/v1/users/' + userId;

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
  }
}
