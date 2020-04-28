import axios from 'axios';

export default {
  getUserData({ userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/users/current';

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
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/users';

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
  },

  getUserProfile(userId) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/profile/" + userId;

    return new Promise((resolve, reject) => {
      axios.get(url).then((response) => {
          resolve(response.data.data);
        }, (error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  }
}
