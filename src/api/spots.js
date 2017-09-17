import axios from 'axios';

export default {
  getAllSpots() {
    let url = 'https://backend.bikeable.ch/api/v1/entries';

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data.data);
        }, response => {
          reject(response.data.message);
        });
    });
  },

  getSpotById(spotId) {

    let url = 'https://backend.bikeable.ch/api/v1/entries/' + spotId;

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
  },

  checkUpvote({ spotId, userId, authToken }) {

    let url = 'https://backend.bikeable.ch/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          () => {
            reject();
          }
        )
        .catch(
          (error) => {
            if(error.response.status == 400) {
              resolve();
            }else{
              reject();
            }
          }
        );
    });
  },

  upvoteSpot({ spotId, userId, authToken }) {

    let url = 'https://backend.bikeable.ch/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios.post(url, {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          (response) => {
            resolve(response.data);
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

  addSpot({ data, userId, authToken}) {

    let url = 'https://backend.bikeable.ch/api/v1/entries'

    return new Promise((resolve, reject) => {
      axios.post(url, data,
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
