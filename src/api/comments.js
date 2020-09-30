import axios from 'axios';

export default {
  getCommentsBySpot(spotId) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/comments?entry=' + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data.data);
        }, response => {
          reject(response.data.message);
        });
    });
  },

  postComment({ entryId, comment, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/comments';

    return new Promise((resolve, reject) => {
      axios.post(
        url,
        {
          'entryId': entryId,
          'text': comment,
          'user': {
            '_id': userId
          }
        },
        {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': authToken
        }
      })
      .then(response => {
        resolve(response.data.data);
      }, response => {
        if(!response.data) return;
        reject(response.data.message);
      });
    });
  }
}
